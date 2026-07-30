import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.enableCors({
    origin: ['http://localhost:4200','http://localhost','todo-angular-ldi68nsh5-zacs-projects-1a93e4d3.vercel.app'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
