import { Injectable } from '@nestjs/common'
import { UseCase } from '@/shared/UseCase'
import { ApplicationError } from '@/shared/Errors'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'
import { AvailableSlotErrorType } from '@/shared/errors/AvaibleSlotErrorType'
import { AvailableSlot } from '@/core/entities/AvaibleSlot'
import { DateTime } from 'luxon'

interface CreateAvailableSlotInput {
    doctorId: string
    dateTime: Date
}

@Injectable()
export class CreateAvailableSlotUseCase implements UseCase<CreateAvailableSlotInput, void> {
    constructor(private readonly slotRepository: AvailableSlotRepository) { }

    async exec(input: CreateAvailableSlotInput): Promise<void> {
        const now = DateTime.now()
        const requestedDate = DateTime.fromJSDate(input.dateTime)

        const invalidDate = requestedDate <= (now)

        if (invalidDate) {
            throw new ApplicationError({
                message: 'A data/hora do horário deve ser futura',
                code: 400,
                type: AvailableSlotErrorType.INVALID_SLOT_DATE
            })
        }

        const isValidWeekDay = requestedDate.weekday <= 5

        if (!isValidWeekDay) {
            throw new ApplicationError({
                message: 'Horários só podem ser criados de segunda a sexta',
                code: 400,
                type: AvailableSlotErrorType.INVALID_SLOT_DATE
            })
        }

        const isCommercialTime = requestedDate.hour > 7 || requestedDate.hour <= 17

        console.log(requestedDate.hour)

        if (!isCommercialTime) {
            throw new ApplicationError({
                message: 'Horário deve estar entre 07:00 e 17:00',
                code: 400,
                type: AvailableSlotErrorType.INVALID_SLOT_DATE
            })
        }
        const alreadyExists = await this.slotRepository.exists(input.doctorId, input.dateTime)

        if (alreadyExists) {
            throw new ApplicationError({
                message: 'Horário já está disponível',
                code: 409,
                type: AvailableSlotErrorType.SLOT_ALREADY_EXISTS
            })
        }

        const slot = new AvailableSlot({
            id: crypto.randomUUID(),
            doctorId: input.doctorId,
            dateTime: input.dateTime,
            isBooked: false
        })

        await this.slotRepository.save(slot)
    }
}
