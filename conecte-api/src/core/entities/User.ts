import { UserRole } from "@/core/enums/UserRole"

export interface UserProps {
    id: string
    name: string
    email: string
    password: string
    role: UserRole
}

export class User {
    constructor(public readonly props: UserProps) { }

    get id(): string {
        return this.props.id
    }

    get name(): string {
        return this.props.name
    }

    get email(): string {
        return this.props.email
    }

    get password(): string {
        return this.props.password
    }

    get role(): UserRole {
        return this.props.role
    }

    isDoctor(): boolean {
        return this.role === UserRole.DOCTOR
    }

    isPatient(): boolean {
        return this.role === UserRole.PATIENT
    }
}
