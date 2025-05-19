import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, next internal routes, and static files
  if (
    pathname.includes("/_next/") ||
    pathname.includes("/favicon.ico") ||
    pathname.includes(".") // Skip files with extensions
  ) {
    return NextResponse.next()
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get("accessToken")?.value


  console.log(authCookie)
  const isAuthenticated = !!authCookie

  // Define protected routes
  const protectedRoutes = ["/dashboard"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Define auth routes
  const authRoutes = ["/auth/login", "/auth/register"]
  const isAuthRoute = authRoutes.includes(pathname)

  // Redirect logic
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login if trying to access protected route without being logged in
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("error", "auth_required")
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && isAuthenticated) {
    // Redirect to dashboard if already logged in and trying to access auth routes
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Update the matcher to be more specific
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files
     * - Favicon.ico
     * - Files with extensions
     */
    "/((?!_next|favicon.ico|.*\\.).+)",
  ],
}
