import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.notification.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, organizationId: string) {
    const existing = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    if (existing.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isSeenOnApp: true },
    });
  }

  async markAllAsRead(organizationId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        organizationId,
        isSeenOnApp: false,
      },
      data: { isSeenOnApp: true },
    });

    return { updatedCount: result.count };
  }
}
