import { Injectable } from '@nestjs/common'
import { DoctorFilters, UserRepository } from '@/core/repositories/UserRepository'
import { UseCase } from '@/shared/UseCase'
import { User } from '@/core/entities/User'
import { UserRole } from '@/core/enums/UserRole'

export interface GetAllDoctorsInput extends DoctorFilters { }
export type GetAllDoctorsOutput = User[]

@Injectable()
export class GetAllDoctorsUseCase implements UseCase<GetAllDoctorsInput, GetAllDoctorsOutput> {
    constructor(private readonly userRepo: UserRepository) { }

    async exec(input: GetAllDoctorsInput): Promise<User[]> {
        const users = await this.userRepo.findAllDoctors(input)
        return users
    }
}
