import {ArgumentsHost, Catch, ExceptionFilter} from "@nestjs/common";
import {Response} from 'express';
import {ValidateException} from "../utils/ValidateException";
import {Logger} from '../utils/log4js';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception:ValidateException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        let msg = exception.message;

        if(exception.errno === -4078){
            msg = '数据库连接失败,检查数据库服务是否启动'
        }

        const errors = exception.errors;
        Logger.debug(`[ValidateException] msg: ${msg} error: ${JSON.stringify(errors)}`)
        response
            .status(500)
            .json({
                code: 500,
                msg,
                errors
            });
    }
}