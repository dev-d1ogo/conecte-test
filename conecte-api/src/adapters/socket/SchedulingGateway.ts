import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: { origin: '*' } })
export class SchedulingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    handleConnection(client: Socket) {
        console.log('🔌 Client connected:', client.id)
    }

    handleDisconnect(client: Socket) {
        console.log('❌ Client disconnected:', client.id)
    }

    // 🔄 Emite evento global
    emitSchedulingCreated(payload: any) {
        this.server.emit('scheduling:created', payload)
    }
}
