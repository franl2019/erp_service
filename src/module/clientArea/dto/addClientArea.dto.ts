import { IsInt, IsNotEmpty, IsString } from "class-validator";
import {IClientArea} from "../clientArea";

export class AddClientAreaDto implements IClientArea{
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

  updatedAt: Date;
  updater: string;

  del_uuid: number;
  deletedAt: Date;
  deleter: string;
}