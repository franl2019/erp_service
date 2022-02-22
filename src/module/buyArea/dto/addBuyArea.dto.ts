import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddBuyAreaDto {
  @IsString()
  @IsNotEmpty()
  buyareacode: string;

  @IsString()
  @IsNotEmpty()
  buyareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;

  creater: string;
  createdAt: Date;
}