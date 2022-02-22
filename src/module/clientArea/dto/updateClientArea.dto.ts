import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateClientAreaDto {
  @IsInt()
  clientareaid: number;

  @IsString()
  @IsNotEmpty()
  clientareacode: string;

  @IsString()
  @IsNotEmpty()
  clientareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;

  updater: string;
  updatedAt: Date;
}