import { AvailableSlot } from "@/core/entities/AvaibleSlot";

export abstract class AvailableSlotRepository {
    abstract findByDoctorId(doctorId: string): Promise<AvailableSlot[]>
    abstract exists(doctorId: string, dateTime: Date): Promise<boolean>
    abstract save(slot: AvailableSlot): Promise<void>
    abstract findById(id: string): Promise<AvailableSlot | null>
    abstract delete(id: string): Promise<void>
}
