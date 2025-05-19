export interface SchedulingProps {
    id: string
    doctorId: string
    patientId: string
    dateTime: Date
}
export type SchedulingWithUserData = Scheduling & {
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

export class Scheduling {
    constructor(public readonly props: SchedulingProps) { }

    get id(): string {
        return this.props.id
    }

    get doctorId(): string {
        return this.props.doctorId
    }

    get patientId(): string {
        return this.props.patientId
    }

    get dateTime(): Date {
        return this.props.dateTime
    }
}
