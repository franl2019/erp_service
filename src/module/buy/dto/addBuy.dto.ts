import { IsInt, IsNotEmpty, IsString, NotEquals } from "class-validator";
import {IBuy} from "../buy";

export class AddBuyDto implements IBuy{
  buyid: number;

  @IsString()
  buycode: string;
  @IsString()
  @IsNotEmpty()
  buyname: string;
  @IsString()
  contactperson: string;
  @IsString()
  salesman: string;
  @IsString()
  ymrep: string;
  @IsString()
  phone_no: string;
  @IsString()
  tel_no: string;
  @IsString()
  email: string;
  @IsString()
  address: string;
  @IsString()
  moneytype: string;
  @IsInt()
  useflag: number;
  @IsInt()
  accountspayabletype: number;
  @IsString()
  remark1: string;
  @IsString()
  remark2: string;
  @IsString()
  remark3: string;
  @IsString()
  remark4: string;
  @IsString()
  remark5: string;
  @IsString()
  remark6: string;
  @IsString()
  remark7: string;
  @IsString()
  remark8: string;
  @IsString()
  remark9: string;
  @IsString()
  remark10: string;

  creater: string;
  createdAt: Date;

  updatedAt: Date;
  updater: string;

  @IsInt()
  @NotEquals(0)
  buyareaid: number;
  @IsInt()
  @NotEquals(0)
  operateareaid: number;


  level1date: Date;
  level1name: string;
  level1review: number;
  level2date: Date;
  level2name: string;
  level2review: number;

  del_uuid: number;
  deletedAt: Date;
  deleter: string;
}