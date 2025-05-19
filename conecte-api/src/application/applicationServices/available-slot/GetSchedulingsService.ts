import { Injectable } from '@nestjs/common'

import { UserErrorType } from '@/shared/errors/UserErrorTypes'
import { ApplicationError } from '@/shared/Errors'
import { UserRole } from '@/core/enums/UserRole'
import { GetSchedulingsByDoctorUseCase } from '@/application/use-cases/scheduling/GetSchedulingsByDoctorUseCase'
import { GetSchedulingsByPatientUseCase } from '@/application/use-cases/scheduling/GetSchedulingsByPatientUseCase'
import { UserJwt } from '@/core/models/UserJwt'
import { SchedulingResponseDTO, SchedulingResponseDTOWithIncludes } from '@/application/dto/scheduling-response.dto'
import { SchedulingMapper } from '@/shared/mappers/SchedulingMapper'

@Injectable()
export class GetSchedulingsService {
    constructor(
        private readonly getByDoctor: GetSchedulingsByDoctorUseCase,
        private readonly getByPatient: GetSchedulingsByPatientUseCase
    ) { }

    async execute(user: UserJwt): Promise<SchedulingResponseDTOWithIncludes[]> {
        switch (user.role) {
            case UserRole.DOCTOR: {
                const schedulings = await this.getByDoctor.exec({ userId: user.id })
                return schedulings
            }

            case UserRole.PATIENT: {
                const schedulings = await this.getByPatient.exec({ userId: user.id })
                return schedulings
            }

            default:
                throw new ApplicationError({
                    message: 'Usuário não autorizado a ver agendamentos',
                    code: 403,
                    type: UserErrorType.UNAUTHORIZED
                })
        }
    }
}