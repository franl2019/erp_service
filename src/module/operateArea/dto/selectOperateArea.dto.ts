import { IsNumber } from "class-validator";

export class SelectOperateAreaDto {
  @IsNumber()
  operateareatype: number;
}