import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { NotificationsService } from './notifications.service.js';

interface AuthRequest extends Request {
  user: { id: string; email: string; organizationId: string };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req: AuthRequest) {
    return this.notificationsService.findAll(req.user.organizationId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.notificationsService.markAsRead(id, req.user.organizationId);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Request() req: AuthRequest) {
    return this.notificationsService.markAllAsRead(req.user.organizationId);
  }
}
