import { Injectable } from '@nestjs/common'
import { SchedulingRepository } from '@/core/repositories/SchedulingRepository'
import { Scheduling } from '@/core/entities/Scheduling'
import { UseCase } from '@/shared/UseCase'
import { SchedulingResponseDTOWithIncludes } from '@/application/dto/scheduling-response.dto'

export interface GetSchedulingsByDoctorInput {
    userId: string
}

@Injectable()
export class GetSchedulingsByDoctorUseCase
    implements UseCase<GetSchedulingsByDoctorInput, SchedulingResponseDTOWithIncludes[]> {
    constructor(private readonly repo: SchedulingRepository) { }

    async exec(input: GetSchedulingsByDoctorInput): Promise<SchedulingResponseDTOWithIncludes[]> {
        return this.repo.findByDoctorIdWithRelations(input.userId)
    }
}
