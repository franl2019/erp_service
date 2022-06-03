import { IsInt, IsNotEmpty, IsString } from "class-validator";
import {IProductArea} from "../productArea";

export class UpdateProductAreaDto implements IProductArea{
  @IsInt()
  productareaid: number;

  @IsString()
  @IsNotEmpty()
  productareacode: string;

  @IsString()
  @IsNotEmpty()
  productareaname: string;

  sonflag: number;

  @IsInt()
  parentid: number;
  parentCode: string;

  createdAt: Date;
  creater: string;

  updater: string;
  updatedAt: Date;

  del_uuid: number;
  deletedAt: Date;
  deleter: string;

}