import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 3000;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableCors({
    origin: '*',
    credentials: false,
  });


  const mainOptions = new DocumentBuilder()
    .setTitle('FGAC Permissions-System API')
    .setDescription('Official API documentation for multi-tenant permissions management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const mainDocument = SwaggerModule.createDocument(app, mainOptions);
  SwaggerModule.setup('api-docs', app, mainDocument);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
