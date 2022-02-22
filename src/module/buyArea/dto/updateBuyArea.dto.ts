import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateBuyAreaDto {
  @IsInt()
  buyareaid: number;

  @IsString()
  @IsNotEmpty()
  buyareacode: string;

  @IsString()
  @IsNotEmpty()
  buyareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;


  updater: string;
  updatedAt: Date;
}