import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with custom configuration
  app.enableCors({
    origin: '*', // Allow requests from any origin. Replace '*' with your domain for more security.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Include all HTTP methods you want to allow.
    allowedHeaders: 'Content-Type, Authorization', // Include all headers your requests will send.
    credentials: true, // If you are using cookies or other credentials.
  });

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
