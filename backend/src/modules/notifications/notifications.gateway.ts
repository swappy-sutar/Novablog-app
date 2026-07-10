import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private isStdoutHooked = false;
  private telemetryInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly jwtService: JwtService,
    private readonly adminService: AdminService,
  ) {}

  onModuleInit() {
    this.hookStdout();
  }

  private hookStdout() {
    if (this.isStdoutHooked) return;
    this.isStdoutHooked = true;
    
    const originalWrite = process.stdout.write;
    process.stdout.write = (chunk: any, encoding?: any, callback?: any): boolean => {
      const logLine = chunk.toString();
      const isGatewayLog = logLine.includes('NotificationsGateway') || 
                           logLine.includes('admin_telemetry') || 
                           logLine.includes('console_log') ||
                           logLine.includes('socket.io') ||
                           logLine.includes('engine') ||
                           logLine.includes('telemetry_update');
      if (this.server && !isGatewayLog && logLine.trim()) {
        const cleanLog = logLine.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
        this.server.to('admin_telemetry').emit('console_log', cleanLog.trim());
      }
      return originalWrite.call(process.stdout, chunk, encoding, callback);
    };
  }

  private startTelemetryStream() {
    if (this.telemetryInterval) return;
    this.telemetryInterval = setInterval(async () => {
      const adminRoom = this.server.sockets.adapter.rooms.get('admin_telemetry');
      if (!adminRoom || adminRoom.size === 0) {
        clearInterval(this.telemetryInterval!);
        this.telemetryInterval = null;
        return;
      }
      try {
        const health = await this.adminService.getSystemHealth();
        if (health && health.success) {
          this.server.to('admin_telemetry').emit('telemetry_update', health.data);
        }
      } catch (e) {
        // ignore
      }
    }, 3000);
  }

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token) {
        this.logger.warn(`Connection attempt without token: client ID ${client.id}`);
        client.disconnect();
        return;
      }

      // Verify token
      const payload = this.jwtService.verify(token);
      const userId = payload.id || payload.sub || payload.userId;

      if (!userId) {
        this.logger.warn(`Token payload does not contain user ID: client ID ${client.id}`);
        client.disconnect();
        return;
      }

      // Associate socket client with user ID room
      await client.join(`user_${userId}`);
      this.logger.log(`Client ${client.id} authenticated and joined room user_${userId}`);

      // If user is ADMIN, also join telemetry streaming room
      if (payload.role === 'ADMIN') {
        await client.join('admin_telemetry');
        this.logger.log(`Client ${client.id} joined admin_telemetry room`);
        this.startTelemetryStream();
      }
    } catch (error) {
      this.logger.error(`Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.logger.log(`Emitting event "${event}" to user_${userId}`);
    this.server.to(`user_${userId}`).emit(event, data);
  }
}
