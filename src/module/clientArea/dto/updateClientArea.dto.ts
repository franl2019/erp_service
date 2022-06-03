import {IsInt, IsNotEmpty, IsString, NotEquals} from "class-validator";
import {IClientArea} from "../clientArea";

export class UpdateClientAreaDto implements IClientArea{
  @IsInt()
  @NotEquals(0)
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
  parentCode: string;

  creater: string;
  createdAt: Date;

  updater: string;
  updatedAt: Date;

  del_uuid: number;
  deletedAt: Date;
  deleter: string;
}