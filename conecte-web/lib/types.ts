export type UserRole = "PATIENT" | "DOCTOR"

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

export interface TimeSlot {
  id: string
  doctorId: string
  dateTime: string
  isBooked: boolean
}

export interface Doctor extends User {
  role: "DOCTOR"
}

export interface Patient extends User {
  role: "PATIENT"
}

export interface Appointment {
  id: string
  slotId: string
  patientId: string
  doctorId: string
  dateTime: string
  patient: Patient
  doctor: Doctor
}

// Extend next-auth types
declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: UserRole
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}
