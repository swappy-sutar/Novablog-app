import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { successResponse } from 'src/common/helpers/response.helper';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@CurrentUser() user: any) {
    const notifications = await this.notificationsService.getNotifications(user.id);
    return successResponse('Notifications fetched successfully', notifications);
  }

  @UseGuards(JwtAuthGuard)
  @Post('read')
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAsRead(user.id);
    return successResponse('All notifications marked as read', null);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/read')
  async markAsRead(@CurrentUser() user: any, @Param('id') id: string) {
    await this.notificationsService.markAsRead(user.id, id);
    return successResponse('Notification marked as read', null);
  }
}
