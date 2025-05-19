export interface AvailableSlotProps {
    id: string
    doctorId: string
    dateTime: Date
    isBooked: boolean
}

export class AvailableSlot {
    constructor(public readonly props: AvailableSlotProps) { }

    get id(): string {
        return this.props.id
    }

    get doctorId(): string {
        return this.props.doctorId
    }

    get dateTime(): Date {
        return this.props.dateTime
    }
}
