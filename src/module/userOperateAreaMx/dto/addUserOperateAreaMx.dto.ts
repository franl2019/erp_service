import { IsInt } from "class-validator";

export class AddUserOperateAreaMxDto {
  @IsInt()
  userid: number;
  @IsInt()
  operateareaid: number;
  @IsInt()
  userflag: number;

  creater: string;
  createdAt: Date;

  constructor() {
    this.createdAt = new Date();
  }
}