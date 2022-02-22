import { IsInt } from "class-validator";

export class SelectUserOperateAreaMxDto {
  @IsInt()
  userid: number;

  @IsInt()
  operateareatype:number
}