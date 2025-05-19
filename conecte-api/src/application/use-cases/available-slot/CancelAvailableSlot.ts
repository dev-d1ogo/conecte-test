// CancelAvailableSlotUseCase.ts
import { Injectable } from '@nestjs/common'
import { UseCase } from '@/shared/UseCase'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'
import { ApplicationError } from '@/shared/Errors'
import { AvailableSlotErrorType } from '@/shared/errors/AvaibleSlotErrorType'

interface CancelAvailableSlotInput {
    doctorId: string
    slotId: string
}

@Injectable()
export class CancelAvailableSlotUseCase implements UseCase<CancelAvailableSlotInput, void> {
    constructor(private readonly slotRepository: AvailableSlotRepository) { }

    async exec(input: CancelAvailableSlotInput): Promise<void> {
        const slot = await this.slotRepository.findById(input.slotId)

        if (!slot) {
            throw new ApplicationError({
                message: 'Horário não encontrado',
                code: 404,
                type: AvailableSlotErrorType.SLOT_NOT_FOUND
            })
        }

        if (slot.doctorId !== input.doctorId) {
            throw new ApplicationError({
                message: 'Este horário não pertence a você',
                code: 403,
                type: AvailableSlotErrorType.UNAUTHORIZED
            })
        }


        const isValidSlotToDelete = slot.props.isBooked == false

        if (!isValidSlotToDelete) {
            throw new ApplicationError({
                message: 'Horário já possui agendamento e não pode ser excluído',
                code: 400,
                type: AvailableSlotErrorType.SLOT_ALREADY_BOOKED
            })
        }

        await this.slotRepository.delete(slot.id)
    }
}
