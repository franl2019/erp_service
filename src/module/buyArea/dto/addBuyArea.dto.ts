import { IsInt, IsNotEmpty, IsString } from "class-validator";
import {IBuyArea} from "../buyArea";

export class AddBuyAreaDto implements IBuyArea{
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

  parentCode: string;

  creater: string;
  createdAt: Date;

  updater: string;
  updatedAt: Date;

  del_uuid: number;
  deletedAt: Date;
  deleter: string;
}