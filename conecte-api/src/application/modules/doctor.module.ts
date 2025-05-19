import { AuthService } from '@/adapters/auth/AuthService'
import { AvailableSlotRepositoryPrisma } from '@/adapters/infra/prisma/AvaibleSlotPrismaRepository'
import { UserRepositoryPrisma } from '@/adapters/infra/prisma/UserPrismaRepository'
import { DoctorController } from '@/application/controller/DoctorController'
import { AuthMiddleware } from '@/application/middleware/auth-middleware'
import { CancelAvailableSlotUseCase } from '@/application/use-cases/available-slot/CancelAvailableSlot'
import { CreateAvailableSlotUseCase } from '@/application/use-cases/available-slot/CreateAvaibleSlot'
import { GetAvailableSlotsByDoctorUseCase } from '@/application/use-cases/available-slot/GetAvailableSlotsByDoctorUseCase'
import { GetAllDoctorsUseCase } from '@/application/use-cases/user/patient/GetAllDoctorsUseCase'
import { AvailableSlotRepository } from '@/core/repositories/AvaibleSlotRepository'
import { UserRepository } from '@/core/repositories/UserRepository'
import { IAuthService } from '@/core/services/IAuthService'
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'


@Module({
    controllers: [DoctorController],
    providers: [
        CreateAvailableSlotUseCase,
        GetAvailableSlotsByDoctorUseCase,
        GetAllDoctorsUseCase,
        CancelAvailableSlotUseCase,
        { provide: AvailableSlotRepository, useClass: AvailableSlotRepositoryPrisma },
        { provide: UserRepository, useClass: UserRepositoryPrisma },
        { provide: IAuthService, useClass: AuthService },


    ]
})
export class DoctorModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes({ path: 'medicos/:id/horarios', method: RequestMethod.POST }, {
                path: 'medicos/horarios/:slotId',
                method: RequestMethod.DELETE
            })
    }
}
