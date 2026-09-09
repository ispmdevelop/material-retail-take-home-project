import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { PrismaModule } from './prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProductModule } from './product/product.module.js';
import { ProductItemModule } from './product-item/product-item.module.js';
import { StoreModule } from './store/store.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    ProductModule,
    ProductItemModule,
    StoreModule,
    NotificationsModule,
  ],
})
export class AppModule {}
