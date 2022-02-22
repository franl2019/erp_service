import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class UpdateOperateAreaDto {
  @IsInt()
  operateareaid: number;

  @IsString()
  @IsNotEmpty()
  operateareaname: string;

  @IsInt()
  operateareatype: number;

  @IsInt()
  useflag: number;

  updater: string;
  updatedAt: Date;
}