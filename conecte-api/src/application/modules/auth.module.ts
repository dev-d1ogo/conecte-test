import { AuthService } from '@/adapters/auth/AuthService';
import { UserRepositoryPrisma } from '@/adapters/infra/prisma/UserPrismaRepository';
import { RegisterUserService } from '@/application/applicationServices/user/RegisterUserService';
import { AuthController } from '@/application/controller/AuthController';
import { RegisterDoctorUseCase } from '@/application/use-cases/user/auth/RegisterDoctor';
import { RegisterPatientUseCase } from '@/application/use-cases/user/auth/RegisterPatient';
import { UserRepository } from '@/core/repositories/UserRepository';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { IAuthService } from '@/core/services/IAuthService';
import { AuthMiddleware } from '@/application/middleware/auth-middleware';
import { AuthenticateUserUseCase } from '@/application/use-cases/user/auth/Login';

@Module({
    controllers: [AuthController],
    providers: [
        RegisterUserService,
        RegisterDoctorUseCase,
        RegisterPatientUseCase,
        AuthenticateUserUseCase,// ← ESSENCIAL: estava faltando
        { provide: IAuthService, useClass: AuthService },
        { provide: UserRepository, useClass: UserRepositoryPrisma }]
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                { path: 'medicos/:id/horarios', method: RequestMethod.POST },
                { path: 'medicos/:id/horarios', method: RequestMethod.GET },
                { path: 'medicos/:id/agendamentos', method: RequestMethod.GET }
            )
    }
}
