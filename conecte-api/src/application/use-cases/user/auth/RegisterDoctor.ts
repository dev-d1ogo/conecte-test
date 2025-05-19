import { RegisterUserInput } from '@/application/applicationServices/user/RegisterUserService'
import { User } from '@/core/entities/User'
import { UserRole } from '@/core/enums/UserRole'
import { UserRepository } from '@/core/repositories/UserRepository'
import { UseCase } from '@/shared/UseCase'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterDoctorUseCase implements UseCase<RegisterUserInput, void> {
    constructor(private readonly userRepository: UserRepository) { }

    async exec(input: RegisterUserInput): Promise<void> {
        const doctor = new User({
            id: crypto.randomUUID(),
            name: input.name,
            email: input.email,
            password: input.password,
            role: UserRole.DOCTOR
        })

        await this.userRepository.save(doctor)
    }
}
