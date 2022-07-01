import { validate } from "class-validator";

export class verifyParamError extends Error{
  status:number;
  message:string;
  errors?:any

  constructor(message: string,errors?: any) {
    super(message);
    this.status = 500;
    this.message = message;
    this.errors = errors
  }
}

export async function useVerifyParam(obj: any) {
  const errors = await validate(obj,{ validationError: { target: false } });
  if (errors.length > 0) {
    return Promise.reject(new verifyParamError("请求参数有误",errors))
  }
}