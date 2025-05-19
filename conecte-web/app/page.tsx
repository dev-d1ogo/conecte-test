import { LandingHero } from "@/components/views/landing-hero"
import { LandingFeatures } from "@/components/views/landing-features"
import { LandingFooter } from "@/components/views/landing-footer"
import { LandingHeader } from "@/components/views/landing-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
      </main>
      <LandingFooter />
    </div>
  )
}
