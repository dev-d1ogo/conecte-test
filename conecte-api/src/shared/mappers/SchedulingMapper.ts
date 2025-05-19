import { SchedulingResponseDTO, SchedulingResponseDTOWithIncludes } from "@/application/dto/scheduling-response.dto"
import { Scheduling, SchedulingWithUserData } from "@/core/entities/Scheduling"

interface SchedulingRaw {
    id: string
    doctorId: string
    patientId: string
    dateTime: Date
}

export class SchedulingMapper {
    static toDomain(raw: SchedulingRaw): Scheduling {
        return new Scheduling({
            id: raw.id,
            doctorId: raw.doctorId,
            patientId: raw.patientId,
            dateTime: raw.dateTime
        })
    }
    static toDomainWithIncludes(data: any): SchedulingWithUserData {
        const base = new Scheduling({
            id: data.id,
            doctorId: data.doctorId,
            patientId: data.patientId,
            dateTime: new Date(data.dateTime)
        })

        // Estendemos a instância com os dados adicionais (doctor/patient)
        return Object.assign(base, {
            doctor: {
                id: data.doctor.id,
                name: data.doctor.name,
                email: data.doctor.email
            },
            patient: {
                id: data.patient.id,
                name: data.patient.name,
                email: data.patient.email
            }
        }) as SchedulingWithUserData
    }

    static toResponseWithIncludes(data: {
        id: string
        doctorId: string
        patientId: string
        dateTime: Date
        doctor: { id: string; name: string; email: string }
        patient: { id: string; name: string; email: string }
    }): SchedulingResponseDTOWithIncludes {
        return {
            id: data.id,
            dateTime: data.dateTime.toISOString(),
            doctor: data.doctor,
            patient: data.patient
        }
    }
    static toPersistence(scheduling: Scheduling): SchedulingRaw {
        return {
            id: scheduling.id,
            doctorId: scheduling.doctorId,
            patientId: scheduling.patientId,
            dateTime: scheduling.dateTime
        }
    }

    static toHttp(scheduling: Scheduling): SchedulingResponseDTO {
        return {
            id: scheduling.id,
            doctorId: scheduling.doctorId,
            patientId: scheduling.patientId,
            dateTime: scheduling.dateTime.toISOString()
        }
    }

    static toResponseList(schedulings: Scheduling[]): SchedulingResponseDTO[] {
        return schedulings.map(this.toHttp)
    }
}
