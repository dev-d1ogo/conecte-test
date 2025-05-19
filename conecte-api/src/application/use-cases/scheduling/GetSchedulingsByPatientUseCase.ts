import { Injectable } from '@nestjs/common'
import { SchedulingRepository } from '@/core/repositories/SchedulingRepository'
import { Scheduling } from '@/core/entities/Scheduling'
import { UseCase } from '@/shared/UseCase'
import { SchedulingResponseDTOWithIncludes } from '@/application/dto/scheduling-response.dto'

export interface GetSchedulingsByPatientInput {
    userId: string
}

@Injectable()
export class GetSchedulingsByPatientUseCase
    implements UseCase<GetSchedulingsByPatientInput, SchedulingResponseDTOWithIncludes[]> {
    constructor(private readonly repo: SchedulingRepository) { }

    async exec(input: GetSchedulingsByPatientInput): Promise<SchedulingResponseDTOWithIncludes[]> {
        return this.repo.findByPatientIdWithRelations(input.userId)
    }
}
