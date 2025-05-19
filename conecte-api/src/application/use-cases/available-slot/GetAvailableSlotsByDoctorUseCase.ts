import { Injectable } from '@nestjs/common'
import { UseCase } from '@/shared/UseCase'
import { DateTime } from 'luxon'
import { AvailableSlot } from '@/core/entities/AvaibleSlot'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'

export interface GetAvailableSlotsByDoctorInput {
    doctorId: string
}

export type GetAvailableSlotsByDoctorOutput = AvailableSlot[]

@Injectable()
export class GetAvailableSlotsByDoctorUseCase
    implements UseCase<GetAvailableSlotsByDoctorInput, GetAvailableSlotsByDoctorOutput> {
    constructor(private readonly slotRepository: AvailableSlotRepository) { }

    async exec(input: GetAvailableSlotsByDoctorInput): Promise<AvailableSlot[]> {
        const slots = await this.slotRepository.findByDoctorId(input.doctorId)
        const now = DateTime.now()

        return slots
    }
}
