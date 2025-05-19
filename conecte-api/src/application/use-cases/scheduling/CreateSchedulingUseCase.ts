import { Injectable } from '@nestjs/common'
import { UseCase } from '@/shared/UseCase'
import { SchedulingRepository } from '@/core/repositories/SchedulingRepository'
import { ApplicationError } from '@/shared/Errors'
import { Scheduling } from '@/core/entities/Scheduling'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'
import { SchedulingErrorType } from '@/shared/errors/SchedulingErrorType'
import { AvailableSlotErrorType } from '@/shared/errors/AvaibleSlotErrorType'
import { SchedulingSocketService } from '@/adapters/socket/SchedulingService'
import { SchedulingMapper } from '@/shared/mappers/SchedulingMapper'
import { UserRepository } from '@/core/repositories/UserRepository'
import { UserErrorType } from '@/shared/errors/UserErrorTypes'

interface CreateSchedulingInput {
    patientId: string
    slotId: string
}

@Injectable()
export class CreateSchedulingUseCase implements UseCase<CreateSchedulingInput, void> {
    constructor(
        private readonly schedulingRepo: SchedulingRepository,
        private readonly slotRepo: AvailableSlotRepository,
        private readonly socketService: SchedulingSocketService,
        private readonly userRepo: UserRepository
    ) { }

    async exec(input: CreateSchedulingInput): Promise<void> {
        const slot = await this.slotRepo.findById(input.slotId)

        if (!slot) {
            throw new ApplicationError({
                message: 'Horário não encontrado',
                code: 404,
                type: AvailableSlotErrorType.SLOT_NOT_FOUND
            })
        }

        console.log(input.patientId)

        const pacient = await this.userRepo.findById(input.patientId)

        if (!pacient) {
            throw new ApplicationError({
                message: 'Paciente não encontrado',
                code: 409,
                type: UserErrorType.USER_NOT_FOUND
            })
        }

        const exists = await this.schedulingRepo.hasConflict(slot.doctorId, slot.dateTime)

        if (exists) {
            throw new ApplicationError({
                message: 'Este horário já foi agendado',
                code: 409,
                type: SchedulingErrorType.SCHEDULING_CONFLICT
            })
        }

        const scheduling = new Scheduling({
            id: crypto.randomUUID(),
            doctorId: slot.doctorId,
            patientId: input.patientId,
            dateTime: slot.dateTime
        })

        await this.schedulingRepo.save(scheduling, input.slotId)

        const schedulingWithIncludes = await this.schedulingRepo.findByIdWithRelations(scheduling.id)

        if (!schedulingWithIncludes) {
            throw new ApplicationError({
                message: 'Erro ao carregar agendamento recém-criado',
                code: 500,
                type: 'INTERNAL_SERVER'
            })
        }

        const response = SchedulingMapper.toResponseWithIncludes(schedulingWithIncludes)
        this.socketService.emitSchedulingCreated(response)

    }
}
