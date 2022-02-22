import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class AddOperateAreaDto {
  @IsString()
  @IsNotEmpty()
  operateareaname: string;

  @IsInt()
  operateareatype: number;

  @IsInt()
  useflag: number;

  creater: string;
  createdAt: Date;
}