import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { ProductItemService } from './product-item.service.js';
import { CreateProductItemDto, UpdateProductItemDto } from './dto/product-item.dto.js';

interface AuthRequest extends Request {
  user: { id: string; email: string; organizationId: string };
}

@Controller('product-items')
@UseGuards(JwtAuthGuard)
export class ProductItemController {
  constructor(private productItemService: ProductItemService) {}

  @Get()
  async findByProduct(@Query('productId') productId: string, @Request() req: AuthRequest) {
    return this.productItemService.findByProduct(productId, req.user.organizationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.productItemService.findOne(id, req.user.organizationId);
  }

  @Post()
  async create(@Body() dto: CreateProductItemDto, @Request() req: AuthRequest) {
    return this.productItemService.create(req.user.organizationId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductItemDto,
    @Request() req: AuthRequest,
  ) {
    return this.productItemService.update(id, req.user.organizationId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.productItemService.remove(id, req.user.organizationId);
  }
}
