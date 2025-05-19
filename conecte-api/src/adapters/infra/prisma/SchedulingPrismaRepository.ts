import { prismaClient } from "@/adapters/infra/prisma/client"
import { SchedulingResponseDTOWithIncludes } from "@/application/dto/scheduling-response.dto"
import { Scheduling, SchedulingWithUserData } from "@/core/entities/Scheduling"
import { SchedulingRepository } from "@/core/repositories/SchedulingRepository"
import { ApplicationError } from "@/shared/Errors"
import { SchedulingErrorType } from "@/shared/errors/SchedulingErrorType"
import { SchedulingMapper } from "@/shared/mappers/SchedulingMapper"


export class SchedulingRepositoryPrisma implements SchedulingRepository {
    async findByDoctorId(doctorId: string): Promise<Scheduling[]> {
        try {
            const records = await prismaClient.scheduling.findMany({ where: { doctorId } })
            return records.map(SchedulingMapper.toDomain)
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao buscar agendamentos do médico',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }
    }

    async findById(schedulingId: string): Promise<Scheduling> {
        try {
            const record = await prismaClient.scheduling.findUniqueOrThrow({ where: { id: schedulingId } })

            return SchedulingMapper.toDomain(record)
        } catch (error) {
            throw new ApplicationError({
                message: 'Agendamento não encontrado',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }
    }

    async cancel(schedulingId: string): Promise<void> {
        // Executa tudo em uma transação
        await prismaClient.$transaction(async (tx) => {
            const scheduling = await tx.scheduling.findUnique({
                where: { id: schedulingId },
                select: { slotId: true }
            });

            if (!scheduling) {
                throw new Error("Agendamento não encontrado.");
            }

            await tx.scheduling.delete({
                where: { id: schedulingId }
            });

            await tx.availableSlot.update({
                where: { id: scheduling.slotId },
                data: { isBooked: false }
            });
        });
    }
    async findByIdWithRelations(id: string): Promise<SchedulingWithUserData | null> {
        try {
            const record = await prismaClient.scheduling.findUnique({
                where: { id },
                include: {
                    doctor: { select: { id: true, name: true, email: true } },
                    patient: { select: { id: true, name: true, email: true } }
                }
            })

            return record ? SchedulingMapper.toDomainWithIncludes(record) : null
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao buscar agendamento por ID (com includes)',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }
    }
    async findByPatientId(patientId: string): Promise<Scheduling[]> {
        try {
            const records = await prismaClient.scheduling.findMany({ where: { patientId } })
            return records.map(SchedulingMapper.toDomain)
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao buscar agendamentos do paciente',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }
    }
    async findByDoctorIdWithRelations(doctorId: string): Promise<SchedulingResponseDTOWithIncludes[]> {
        try {
            const records = await prismaClient.scheduling.findMany({
                where: { doctorId },
                include: {
                    doctor: { select: { id: true, name: true, email: true } },
                    patient: { select: { id: true, name: true, email: true } }
                }
            })

            return records.map(SchedulingMapper.toResponseWithIncludes)
        } catch (error) {
            console.log(error)
            throw new ApplicationError({
                message: 'Erro ao buscar agendamentos do médico (com includes)',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }
    }

    async findByPatientIdWithRelations(patientId: string): Promise<SchedulingResponseDTOWithIncludes[]> {
        try {
            const records = await prismaClient.scheduling.findMany({
                where: { patientId },
                include: {
                    doctor: { select: { id: true, name: true, email: true } },
                    patient: { select: { id: true, name: true, email: true } }
                }
            })

            return records.map(SchedulingMapper.toResponseWithIncludes)
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao buscar agendamentos do paciente (com includes)',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_NOT_FOUND
            })
        }
    }



    async hasConflict(doctorId: string, dateTime: Date): Promise<boolean> {
        try {
            const existing = await prismaClient.scheduling.findFirst({ where: { doctorId, dateTime } })
            return !!existing
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao verificar conflito de agendamento',
                code: 500,
                type: SchedulingErrorType.SCHEDULING_CONFLICT
            })
        }
    }

    async save(scheduling: Scheduling, slotId: string): Promise<void> {
        try {
            const data = SchedulingMapper.toPersistence(scheduling)

            console.log(data)

            await prismaClient.$transaction([
                prismaClient.scheduling.create({ data: { ...data, slotId: slotId } }),
                prismaClient.availableSlot.update({
                    data: { isBooked: true },
                    where: { id: slotId }
                })
            ])

        } catch (error) {
            console.log(error)
            throw new ApplicationError({
                message: 'Erro ao salvar agendamento',
                code: 500,
                type: SchedulingErrorType.VALIDATION_ERROR
            })
        }
    }
}
