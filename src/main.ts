import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MongoExceptionFilter } from './common/errors/mongo-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:'*',
    credentials:true,
    methods:'*',
    optionsSuccessStatus:200
  })
  app.setGlobalPrefix("api")
  
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true
  }))
  await app.listen(5000);
}
bootstrap();
