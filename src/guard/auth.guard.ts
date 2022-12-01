import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
      private readonly jwtService: JwtService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const url = request.url;
    const noVerifyURL = [
      "/auth/register",//注册
      "/auth/login",//登录
    ];
    const token = request.headers.token;
    request.state = {
      token: {
        userid: 0
      }
    };
    if (noVerifyURL.indexOf(url) !== -1) {
      return true;
    } else {
      try {
        const decoded = this.jwtService.verify(token)
        request.state.token.userid = JSON.parse(JSON.stringify(decoded)).userid
        return true;
      } catch (e) {
        return Promise.reject(new Error("TOKEN信息错误"))
      }
    }
  }
}
