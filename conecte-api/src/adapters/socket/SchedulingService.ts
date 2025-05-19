import { Injectable } from '@nestjs/common'
import { SchedulingResponseDTOWithIncludes } from '@/application/dto/scheduling-response.dto'
import { SchedulingGateway } from '@/adapters/socket/SchedulingGateway'

@Injectable()
export class SchedulingSocketService {
    constructor(private readonly gateway: SchedulingGateway) { }

    emitSchedulingCreated(scheduling: SchedulingResponseDTOWithIncludes) {
        this.gateway.emitSchedulingCreated(scheduling)
    }
}
