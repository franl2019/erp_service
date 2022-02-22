import { HttpException } from "@nestjs/common";

export class ValidateException extends HttpException {
  errors?:any
  constructor(errors?) {
    super('请求参数有误',500);
    this.errors = errors || [];
  }
}