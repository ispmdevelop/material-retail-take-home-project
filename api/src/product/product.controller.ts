import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { ProductService } from './product.service.js';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto.js';

interface AuthRequest extends Request {
  user: { id: string; email: string; organizationId: string };
}

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll(@Request() req: AuthRequest) {
    return this.productService.findAll(req.user.organizationId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.productService.findOne(id, req.user.organizationId);
  }

  @Post()
  async create(@Body() dto: CreateProductDto, @Request() req: AuthRequest) {
    return this.productService.create(req.user.organizationId, dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Request() req: AuthRequest,
  ) {
    return this.productService.update(id, req.user.organizationId, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.productService.remove(id, req.user.organizationId);
  }
}
