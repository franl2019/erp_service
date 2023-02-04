import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {HttpExceptionFilter} from './filter/httpException.filter';
import {Logger} from './utils/log4js';
import {ValidateException} from './utils/ValidateException';

const port = 3001;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
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
    await app.listen(port);
}

bootstrap().then(() => {
    Logger.info(`server start ,listen port ${port}`);
});
