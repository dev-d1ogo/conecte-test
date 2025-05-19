import { prismaClient } from "@/adapters/infra/prisma/client"
import { AvailableSlot } from "@/core/entities/AvaibleSlot"
import { AvailableSlotRepository } from "@/core/repositories/AvaibleSlotRepository"
import { ApplicationError } from "@/shared/Errors"
import { AvailableSlotErrorType } from "@/shared/errors/AvaibleSlotErrorType"
import { AvailableSlotMapper } from "@/shared/mappers/AvaibleSlotMapper"



export class AvailableSlotRepositoryPrisma implements AvailableSlotRepository {
    async findById(id: string): Promise<AvailableSlot | null> {
        const result = await prismaClient.availableSlot.findUnique({
            where: { id }
        })

        if (!result) return null

        return AvailableSlotMapper.toDomain(result)
    }

    async findByDoctorId(doctorId: string): Promise<AvailableSlot[]> {
        try {
            const slots = await prismaClient.availableSlot.findMany({ where: { doctorId } })
            return slots.map(AvailableSlotMapper.toDomain)
        } catch (error) {
            throw new ApplicationError({
                message: 'Erro ao buscar horários disponíveis',
                code: 500,
                type: AvailableSlotErrorType.SLOT_NOT_FOUND
            })
        }
    }

    async exists(doctorId: string, dateTime: Date): Promise<boolean> {
        try {
            const existing = await prismaClient.availableSlot.findFirst({ where: { doctorId, dateTime } })
            return !!existing
        } catch (error) {
            console.log(error)

            throw new ApplicationError({
                message: 'Erro ao verificar horário',
                code: 500,
                type: AvailableSlotErrorType.SLOT_ALREADY_EXISTS
            })
        }
    }

    async save(slot: AvailableSlot): Promise<void> {
        try {
            const data = AvailableSlotMapper.toPersistence(slot)

            console.log(data)

            await prismaClient.availableSlot.create({ data })
        } catch (error) {
            console.log(error)

            throw new ApplicationError({
                message: 'Erro ao salvar horário',
                code: 500,
                type: AvailableSlotErrorType.VALIDATION_ERROR
            })
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await prismaClient.availableSlot.delete({
                where: { id }
            })
        } catch (error) {
            console.log(error)

            throw new ApplicationError({
                message: 'Erro ao apagar horário',
                code: 500,
                type: AvailableSlotErrorType.VALIDATION_ERROR
            })
        }

    }
}
