import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddClientAreaDto {
  @IsString()
  @IsNotEmpty()
  clientareacode: string;

  @IsString()
  @IsNotEmpty()
  clientareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;

  creater: string;
  createdAt: Date;
}