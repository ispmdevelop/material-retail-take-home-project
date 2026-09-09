import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { PurchaseDto } from './dto/store.dto.js';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async getItems(organizationId: string) {
    const items = await this.prisma.productItem.findMany({
      where: { organizationId },
      include: {
        product: {
          select: { name: true },
        },
      },
      orderBy: [{ product: { name: 'asc' } }, { name: 'asc' }],
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price.toNumber(),
      variants: item.variants as Record<string, string>,
      stock: item.stock,
      stockAlertBelow: item.stockAlertBelow,
      productName: item.product.name,
    }));
  }

  async purchase(organizationId: string, dto: PurchaseDto) {
    const item = await this.prisma.productItem.findUnique({
      where: { id: dto.productItemId },
    });

    if (!item) {
      throw new NotFoundException('Product item not found');
    }

    if (item.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    if (item.stock < dto.quantity) {
      throw new BadRequestException(
        `Only ${item.stock} in stock. Requested: ${dto.quantity}`,
      );
    }

    const updated = await this.prisma.productItem.update({
      where: { id: dto.productItemId },
      data: {
        stock: {
          decrement: dto.quantity,
        },
      },
    });

    if (updated.stockAlertBelow > 0 && updated.stock <= updated.stockAlertBelow) {
      await this.prisma.notification.create({
        data: {
          title: 'Low stock alert',
          description: `"${item.name}" stock dropped to ${updated.stock} (threshold: ${updated.stockAlertBelow})`,
          action: 'restock',
          isSeenOnApp: false,
          isEmailSent: false,
          organizationId,
        },
      });
    }

    return {
      success: true,
      productItemId: updated.id,
      previousStock: item.stock,
      remainingStock: updated.stock,
      purchased: dto.quantity,
    };
  }
}
