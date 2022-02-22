import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Logger } from "../utils/log4js";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    function countEndTime() {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      Logger.info(`[Req] [${responseTime}ms] [ip]${req.ip} [Url]:${req.url},[Body]:${JSON.stringify(req.body)}`);
    }

    req.once("close", countEndTime);
    next();
  }
}