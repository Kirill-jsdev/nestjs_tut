import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //transforms a plain object into a class instance of DTO object. Cool feature
      transformOptions: { enableImplicitConversion: true }, //this will enable implicit conversion of types like string to number or boolean in query params or path params
    }),
  );

  //swagger
  const config = new DocumentBuilder()
    .setTitle('Nest JS API Documentation')
    .setDescription('Use http://localhost:3000/ as base API')
    .setTermsOfService('http://localhost:3000/terms')
    .setLicense('MIT', 'http://localhost:3000/license')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
