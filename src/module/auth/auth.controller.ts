import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authServer: AuthService) {
  }

  @Post("login")
  async login(@Body() login: LoginDto) {
    const token = await this.authServer.login(login.usercode, login.password);

    return {
      code: 200,
      msg: "登录成功",
      token: token
    };
  }

  @Post("register")
  async register(@Body() register:RegisterDto){
    await this.authServer.register(register);
    return {
      code: 200,
      msg: "注册成功"
    };
  }

}
