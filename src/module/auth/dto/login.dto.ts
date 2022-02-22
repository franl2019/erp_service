import { IsNotEmpty} from "class-validator";

export class LoginDto {
  @IsNotEmpty({message:"请输入账号"})
  usercode: string;

  @IsNotEmpty({message:"请输入密码"})
  password: string;
}