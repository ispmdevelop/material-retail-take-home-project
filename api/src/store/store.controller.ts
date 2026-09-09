import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { StoreService } from './store.service.js';
import { PurchaseDto } from './dto/store.dto.js';

interface AuthRequest extends Request {
  user: { id: string; email: string; organizationId: string };
}

@Controller('store')
@UseGuards(JwtAuthGuard)
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('items')
  async getItems(@Request() req: AuthRequest) {
    return this.storeService.getItems(req.user.organizationId);
  }

  @Post('purchase')
  async purchase(@Body() dto: PurchaseDto, @Request() req: AuthRequest) {
    return this.storeService.purchase(req.user.organizationId, dto);
  }
}
