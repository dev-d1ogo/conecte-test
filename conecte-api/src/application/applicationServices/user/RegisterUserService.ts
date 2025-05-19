import { RegisterDoctorUseCase } from '@/application/use-cases/user/auth/RegisterDoctor'
import { RegisterPatientUseCase } from '@/application/use-cases/user/auth/RegisterPatient'
import { UserRole } from '@/core/enums/UserRole'
import { UserRepository } from '@/core/repositories/UserRepository'
import { IAuthService } from '@/core/services/IAuthService'
import { ApplicationError } from '@/shared/Errors'
import { UserErrorType } from '@/shared/errors/UserErrorTypes'
import { UseCase } from '@/shared/UseCase'
import { Injectable } from '@nestjs/common'


export interface RegisterUserInput {
    name: string
    email: string
    password: string // já vem com hash
    role: UserRole
}

@Injectable()
export class RegisterUserService {
    private readonly strategy: Record<UserRole, UseCase<RegisterUserInput, void>>

    constructor(
        private readonly userRepository: UserRepository,
        private readonly authService: IAuthService,
        doctorUseCase: RegisterDoctorUseCase,
        patientUseCase: RegisterPatientUseCase
    ) {
        this.strategy = {
            [UserRole.DOCTOR]: doctorUseCase,
            [UserRole.PATIENT]: patientUseCase
        }
    }

    async execute(data: RegisterUserInput): Promise<void> {

        const existingUser = await this.userRepository.findByEmail(data.email)
        if (existingUser) {
            throw new ApplicationError({
                message: 'E-mail já cadastrado',
                code: 409,
                type: UserErrorType.USER_ALREADY_EXISTS
            })
        }

        const hashedPassword = await this.authService.hashPassword(data.password)

        const useCase = this.strategy[data.role]

        if (!useCase) {
            throw new ApplicationError({
                message: 'Invalid user role',
                code: 400,
                type: UserErrorType.VALIDATION_ERROR
            })
        }

        await useCase.exec({
            ...data,
            password: hashedPassword
        })
    }
}
