import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor() {
  }

  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const url = req.url;
    const noVerifyURL = [
      "/auth/register",//注册
      "/auth/login"//登录
    ];
    const token = req.headers.token;
    if (noVerifyURL.indexOf(url) !== -1) {
      return true;
    } else {
      try {
        const decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY);
        const userid = JSON.parse(JSON.stringify(decoded)).userid;
        req.state = {
          token: {
            userid: userid
          }
        };
        return true;
      } catch (e) {
        return false;
      }
    }
  }
}
