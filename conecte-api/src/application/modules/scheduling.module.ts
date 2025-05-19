import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { SchedulingRepository } from '@/core/repositories/SchedulingRepository'
import { SchedulingRepositoryPrisma } from '@/adapters/infra/prisma/SchedulingPrismaRepository'
import { SchedulingController } from '@/application/controller/SchedulingController'
import { GetSchedulingsByDoctorUseCase } from '@/application/use-cases/scheduling/GetSchedulingsByDoctorUseCase'
import { GetSchedulingsByPatientUseCase } from '@/application/use-cases/scheduling/GetSchedulingsByPatientUseCase'
import { AuthMiddleware } from '@/application/middleware/auth-middleware'
import { GetSchedulingsService } from '@/application/applicationServices/available-slot/GetSchedulingsService'
import { IAuthService } from '@/core/services/IAuthService'
import { AuthService } from '@/adapters/auth/AuthService'
import { CreateSchedulingUseCase } from '@/application/use-cases/scheduling/CreateSchedulingUseCase'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'
import { AvailableSlotRepositoryPrisma } from '@/adapters/infra/prisma/AvaibleSlotPrismaRepository'
import { SchedulingGateway } from '@/adapters/socket/SchedulingGateway'
import { SchedulingSocketService } from '@/adapters/socket/SchedulingService'
import { UserRepositoryPrisma } from '@/adapters/infra/prisma/UserPrismaRepository'
import { UserRepository } from '@/core/repositories/UserRepository'
import { CancelSchedulingUseCase } from '@/application/use-cases/scheduling/CancelSchedulingUseCase'

@Module({
    controllers: [SchedulingController],
    providers: [
        GetSchedulingsService,
        GetSchedulingsByDoctorUseCase,
        GetSchedulingsByPatientUseCase,
        CancelSchedulingUseCase,
        CreateSchedulingUseCase,
        SchedulingGateway,
        SchedulingSocketService,
        { provide: SchedulingRepository, useClass: SchedulingRepositoryPrisma },
        { provide: AvailableSlotRepository, useClass: AvailableSlotRepositoryPrisma },
        { provide: UserRepository, useClass: UserRepositoryPrisma },

        { provide: IAuthService, useClass: AuthService },

    ]
})
export class SchedulingModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: 'agendamentos', method: RequestMethod.GET }, { path: 'agendamentos', method: RequestMethod.POST }, { path: 'agendamentos/:id', method: RequestMethod.DELETE })

    }
}