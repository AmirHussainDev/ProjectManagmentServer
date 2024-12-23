import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://veins-group-of-companies.web.app/',     
    ],
    methods: ["GET", "POST","PUT"],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
