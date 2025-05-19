import { Injectable } from '@nestjs/common'
import { UseCase } from '@/shared/UseCase'
import { SchedulingRepository } from '@/core/repositories/SchedulingRepository'
import { ApplicationError } from '@/shared/Errors'
import { Scheduling } from '@/core/entities/Scheduling'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'
import { SchedulingErrorType } from '@/shared/errors/SchedulingErrorType'
import { AvailableSlotErrorType } from '@/shared/errors/AvaibleSlotErrorType'
import { UserJwt } from '@/core/models/UserJwt'


interface CancelSchedulingInput {
    id: string
    user: UserJwt
}

@Injectable()
export class CancelSchedulingUseCase implements UseCase<CancelSchedulingInput, void> {
    constructor(
        private readonly schedulingRepo: SchedulingRepository,
    ) { }

    async exec(input: CancelSchedulingInput): Promise<void> {
        const scheduling = await this.schedulingRepo.findById(input.id)

        if (!scheduling) {
            throw new ApplicationError({
                message: 'Agendamento não encontrado',
                code: 404,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }

        const validUsersToCancel = [scheduling.doctorId, scheduling.patientId]
        const isValidUserToCancelScheduling = validUsersToCancel.includes(input.user.id)

        if (!isValidUserToCancelScheduling) {
            throw new ApplicationError({
                message: 'Usuário não tem permissão para apagar esse agendamento',
                code: 404,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }

        await this.schedulingRepo.cancel(input.id)

    }
}
