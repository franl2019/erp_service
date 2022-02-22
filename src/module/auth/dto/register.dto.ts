import { IsString, IsNotEmpty } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  usercode: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}