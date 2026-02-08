// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    // This loads your .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // This connects to MongoDB using the secret string from .env
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    
    AuthModule,
    
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}