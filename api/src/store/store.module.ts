import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { StoreController } from './store.controller.js';
import { StoreService } from './store.service.js';

@Module({
  imports: [AuthModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
