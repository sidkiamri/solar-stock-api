// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // Render uses process.env.PORT. '0.0.0.0' is required for external access.
  await app.listen(process.env.PORT || 3000, '0.0.0.0'); 
  
  console.log(`Application is running`);
}
bootstrap();