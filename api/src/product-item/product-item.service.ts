import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateProductItemDto, UpdateProductItemDto } from './dto/product-item.dto.js';

@Injectable()
export class ProductItemService {
  constructor(private prisma: PrismaService) {}

  async findByProduct(productId: string, organizationId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.productItem.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, organizationId: string) {
    const item = await this.prisma.productItem.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!item) {
      throw new NotFoundException('Product item not found');
    }

    if (item.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  async create(organizationId: string, dto: CreateProductItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    const created = await this.prisma.productItem.create({
      data: {
        name: dto.name,
        price: dto.price,
        variants: dto.variants || {},
        stock: dto.stock,
        stockAlertBelow: dto.stockAlertBelow,
        productId: dto.productId,
        organizationId,
      },
    });

    if (created.stockAlertBelow > 0 && created.stock <= created.stockAlertBelow) {
      await this.prisma.notification.create({
        data: {
          title: 'Low stock alert',
          description: `"${created.name}" stock is at ${created.stock} (threshold: ${created.stockAlertBelow})`,
          action: 'restock',
          isSeenOnApp: false,
          isEmailSent: false,
          organizationId,
        },
      });
    }

    return created;
  }

  async update(id: string, organizationId: string, dto: UpdateProductItemDto) {
    const existing = await this.prisma.productItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product item not found');
    }

    if (existing.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    const data: Record<string, unknown> = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.price !== undefined) data.price = dto.price;
    if (dto.variants !== undefined) data.variants = dto.variants;
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.stockAlertBelow !== undefined) data.stockAlertBelow = dto.stockAlertBelow;

    const updated = await this.prisma.productItem.update({
      where: { id },
      data,
    });

    if (updated.stockAlertBelow > 0 && updated.stock <= updated.stockAlertBelow) {
      await this.prisma.notification.create({
        data: {
          title: 'Low stock alert',
          description: `"${updated.name}" stock is at ${updated.stock} (threshold: ${updated.stockAlertBelow})`,
          action: 'restock',
          isSeenOnApp: false,
          isEmailSent: false,
          organizationId,
        },
      });
    }

    return updated;
  }

  async remove(id: string, organizationId: string) {
    const existing = await this.prisma.productItem.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product item not found');
    }

    if (existing.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.productItem.delete({
      where: { id },
    });

    return { id };
  }
}
