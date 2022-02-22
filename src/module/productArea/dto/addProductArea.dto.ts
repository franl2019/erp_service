import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddProductAreaDto {
  @IsString()
  @IsNotEmpty()
  productareacode: string;

  @IsString()
  @IsNotEmpty()
  productareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;

  creater: string;
  createdAt: Date;
}