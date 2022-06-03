import { IsInt, IsNotEmpty, IsString } from "class-validator";
import {IProductArea} from "../productArea";

export class AddProductAreaDto implements IProductArea{
  @IsString()
  @IsNotEmpty()
  productareacode: string;

  @IsString()
  @IsNotEmpty()
  productareaname: string;
  productareaid: number;
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