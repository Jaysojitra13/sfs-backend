import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from './common/custom-exception.filter';
import { AuthMiddleware } from './auth/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform request data to DTO objects
      whitelist: true, // Remove any additional properties from incoming data
    }),
  );

  app.useGlobalFilters(new CustomExceptionFilter());
  
  await app.listen(3000);
}
bootstrap();
