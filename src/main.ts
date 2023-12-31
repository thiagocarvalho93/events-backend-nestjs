import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/exception-filters/prisma.exception-filter';
import { InvalidOperationExceptionFilter } from './common/exception-filters/invalid-operation.exception-filter';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalFilters(
    new PrismaExceptionFilter(),
    new InvalidOperationExceptionFilter(),
  );
  app.useGlobalPipes(new ValidationPipe());

  // swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Events API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
    },
  });

  await app.listen(3000);
}
bootstrap();
