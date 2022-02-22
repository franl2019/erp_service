import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateProductAreaDto {
  @IsInt()
  productareaid: number;

  @IsString()
  @IsNotEmpty()
  productareacode: string;

  @IsString()
  @IsNotEmpty()
  productareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;

  updater: string;
  updatedAt: Date;
}