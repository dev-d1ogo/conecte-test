import { GetSchedulingsService } from '@/application/applicationServices/available-slot/GetSchedulingsService';
import {
    CancelSchedulingDTO,
    CancelSchedulingSchema,
} from '@/application/dto/cancel-scheduling.dto';
import {
    CreateSchedulingDTO,
    CreateSchedulingSchema,
} from '@/application/dto/create-scheduling.dto';
import {
    SchedulingUserDTO,
    SchedulingUserSchema,
} from '@/application/models/scheduling-user.dto';
import { CancelSchedulingUseCase } from '@/application/use-cases/scheduling/CancelSchedulingUseCase';
import { CreateSchedulingUseCase } from '@/application/use-cases/scheduling/CreateSchedulingUseCase';
import { UserJwt } from '@/core/models/UserJwt';
import { RequestValidator } from '@/helpers/ErrorValidator';
import { ApplicationError } from '@/shared/Errors';
import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('agendamentos')
export class SchedulingController {
    constructor(
        private readonly getSchedulingsService: GetSchedulingsService,
        private readonly createSchedulingUseCase: CreateSchedulingUseCase,
        private readonly cancelSchedulingUseCase: CancelSchedulingUseCase,

    ) { }

    @Get()
    async list(@Req() req: Request) {
        const validated = RequestValidator.validate<UserJwt>(
            req.user,
            SchedulingUserSchema,
        );
        return this.getSchedulingsService.execute(validated);
    }
    // src/infra/http/controllers/scheduling.controller.ts
    @Delete('/:id')
    async cancel(@Req() req: Request, @Param() params: any) {
        const { id } = RequestValidator.validate<CancelSchedulingDTO>(
            params,
            CancelSchedulingSchema,
        );

        const user = RequestValidator.validate<SchedulingUserDTO>(
            req.user,
            SchedulingUserSchema,
        );

        await this.cancelSchedulingUseCase.exec({ id, user });
        return { success: true };
    }

    @Post()
    async create(@Req() req: Request, @Body() body: any) {
        const user = RequestValidator.validate<SchedulingUserDTO>(
            req.user,
            SchedulingUserSchema,
        );
        const data = RequestValidator.validate<CreateSchedulingDTO>(
            body,
            CreateSchedulingSchema,
        );

        console.log(user);

        if (user.role !== 'PATIENT') {
            throw new ApplicationError({
                message: 'Somente pacientes podem criar agendamentos',
                code: 403,
                type: 'UNAUTHORIZED',
            });
        }

        await this.createSchedulingUseCase.exec({
            patientId: user.id,
            slotId: data.slotId,
        });

        return {
            message: 'Agendamento criado com sucesso',
        };
    }
}
