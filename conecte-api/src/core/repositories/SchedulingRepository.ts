import { SchedulingResponseDTOWithIncludes } from "@/application/dto/scheduling-response.dto";
import { Scheduling, SchedulingWithUserData } from "@/core/entities/Scheduling";

export abstract class SchedulingRepository {
    abstract findByDoctorId(doctorId: string): Promise<Scheduling[]>
    abstract findByPatientId(patientId: string): Promise<Scheduling[]>
    abstract findByPatientIdWithRelations(patientId: string): Promise<SchedulingResponseDTOWithIncludes[]>
    abstract findByDoctorIdWithRelations(doctorId: string): Promise<SchedulingResponseDTOWithIncludes[]>
    abstract hasConflict(doctorId: string, dateTime: Date): Promise<boolean>
    abstract save(scheduling: Scheduling, slotId: string): Promise<void>
    abstract findByIdWithRelations(id: string): Promise<SchedulingWithUserData | null>
    abstract cancel(schedulingId: string): Promise<void>
    abstract findById(schedulingId: string): Promise<Scheduling>
}
