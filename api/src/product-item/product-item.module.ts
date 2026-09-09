import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ProductItemController } from './product-item.controller.js';
import { ProductItemService } from './product-item.service.js';

@Module({
  imports: [AuthModule],
  controllers: [ProductItemController],
  providers: [ProductItemService],
  exports: [ProductItemService],
})
export class ProductItemModule {}
