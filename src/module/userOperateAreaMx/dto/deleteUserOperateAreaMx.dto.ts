import { IsInt } from "class-validator";

export class DeleteUserOperateAreaMxDto {
  @IsInt()
  userid:number;

  @IsInt()
  operateareaid:number;
}