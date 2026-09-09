import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string) {
    return this.prisma.product.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  }

  async findOne(id: string, organizationId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return product;
  }

  async create(organizationId: string, dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        organizationId,
        items: {
          create: {
            name: dto.name,
            price: dto.price,
            stock: dto.stock,
            stockAlertBelow: dto.stockAlertBelow,
            organizationId,
          },
        },
      },
      include: {
        items: true,
      },
    });

    return product;
  }

  async update(id: string, organizationId: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (existing.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async remove(id: string, organizationId: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    if (existing.organizationId !== organizationId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { id };
  }
}
