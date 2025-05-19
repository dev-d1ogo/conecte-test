export interface SchedulingResponseDTO {
    id: string
    doctorId: string
    patientId: string
    dateTime: string
}


export interface SchedulingResponseDTOWithIncludes {
    id: string
    dateTime: string
    doctor: {
        id: string
        name: string
        email: string
    }
    patient: {
        id: string
        name: string
        email: string
    }
}
