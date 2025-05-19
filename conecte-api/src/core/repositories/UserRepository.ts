import { User } from "@/core/entities/User";

export interface DoctorFilters {
    name?: string
    order?: 'asc' | 'desc'
}

export abstract class UserRepository {
    abstract findByEmail(email: string): Promise<User | null>
    abstract findById(id: string): Promise<User | null>
    abstract findAllDoctors(filters: DoctorFilters): Promise<User[]>
    abstract save(user: User): Promise<void>
}
