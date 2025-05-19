import { prismaClient } from "@/adapters/infra/prisma/client"
import { User } from "@/core/entities/User"
import { DoctorFilters, UserRepository } from "@/core/repositories/UserRepository"
import { ApplicationError } from "@/shared/Errors"
import { UserErrorType } from "@/shared/errors/UserErrorTypes"
import { UserMapper } from "@/shared/mappers/UserMapper"


export class UserRepositoryPrisma implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await prismaClient.user.findUnique({ where: { email } })
            return user ? UserMapper.toDomain(user) : null
        } catch (error) {
            console.error(error)
            throw new ApplicationError({
                message: 'Erro ao buscar usuário por e-mail',
                code: 500,
                type: UserErrorType.USER_NOT_FOUND
            })
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const user = await prismaClient.user.findUnique({ where: { id } })
            return user ? UserMapper.toDomain(user) : null
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao buscar usuário por ID',
                code: 500,
                type: UserErrorType.USER_NOT_FOUND
            })
        }
    }

    async findAllDoctors(filters: DoctorFilters): Promise<User[]> {
        const result = await prismaClient.user.findMany({
            where: {
                role: 'DOCTOR',
                name: filters.name ? { contains: filters.name, mode: 'insensitive' } : undefined
            },
            orderBy: filters.order ? { createdAt: filters.order } : undefined
        })

        return result.map(UserMapper.toDomain)
    }


    async save(user: User): Promise<void> {
        try {
            const data = UserMapper.toPersistence(user)
            await prismaClient.user.create({ data })
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao salvar usuário',
                code: 500,
                type: UserErrorType.VALIDATION_ERROR
            })
        }
    }
}