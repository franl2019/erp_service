import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filter/httpException.filter';
import { AuthGuard } from './guard/auth.guard';
import { Logger } from './utils/log4js';
import { ValidateException } from './utils/ValidateException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new AuthGuard());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      disableErrorMessages: false,
      exceptionFactory(errors) {
        throw new ValidateException(errors);
      },
    }),
  );
  await app.listen(3001);
}

bootstrap().then(() => {
  Logger.info('server start ,listen port 3001');
});
