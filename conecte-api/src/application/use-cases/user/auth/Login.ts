import { Injectable } from '@nestjs/common'
import { UseCase } from '@/shared/UseCase'
import { UserRepository } from '@/core/repositories/UserRepository'
import { IAuthService } from '@/core/services/IAuthService'
import { ApplicationError } from '@/shared/Errors'
import { UserErrorType } from '@/shared/errors/UserErrorTypes'
import { UserJwt } from '@/core/models/UserJwt'

interface AuthenticateUserInput {
    email: string
    password: string
}

interface AuthenticateUserOutput {
    token: string
    user: UserJwt
}

@Injectable()
export class AuthenticateUserUseCase
    implements UseCase<AuthenticateUserInput, AuthenticateUserOutput> {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly authService: IAuthService
    ) { }

    async exec(input: AuthenticateUserInput): Promise<AuthenticateUserOutput> {
        const user = await this.userRepo.findByEmail(input.email)

        if (!user) {
            throw new ApplicationError({
                message: 'Credenciais inválidas',
                code: 401,
                type: UserErrorType.INVALID_CREDENTIALS
            })
        }

        const isValid = await this.authService.verifyPassword(input.password, user.password)

        if (!isValid) {
            throw new ApplicationError({
                message: 'Credenciais inválidas',
                code: 401,
                type: UserErrorType.INVALID_CREDENTIALS
            })
        }

        const token = await this.authService.generateToken(user)

        return {
            token,
            user: {
                name: user.name,
                id: user.id,
                email: user.email,
                role: user.role
            }
        }
    }
}
