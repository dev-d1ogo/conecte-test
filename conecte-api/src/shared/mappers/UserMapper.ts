import { DoctorResponseDTO } from "@/application/dto/doctor-response.dto"
import { User } from "@/core/entities/User"
import { UserRole } from "@/core/enums/UserRole"
import { User as PrismaUser } from '@prisma/client'

interface UserRaw {
    id: string
    name: string
    email: string
    password: string
    role: string
}

export class UserMapper {
    static toDomain(raw: UserRaw): User {
        return new User({
            id: raw.id,
            name: raw.name,
            email: raw.email,
            password: raw.password,
            role: raw.role as UserRole
        })
    }

    static toPersistence(user: User): PrismaUser {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: new Date(),  // preencher se não existir na entidade
            updatedAt: new Date()   // idem
        }
    }

    static toHttp(user: User) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    }

    static toDoctorResponseList(users: User[]): DoctorResponseDTO[] {
        return users.map(this.toHttp)
    }
}
