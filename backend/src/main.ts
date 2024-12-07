import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // 自动删除DTO中未声明的属性
    forbidNonWhitelisted: true, // 阻止传入DTO中未声明的属性
    transform: true, // 自动转换DTO
  }));
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
