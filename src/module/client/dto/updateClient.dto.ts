import { IsInt, IsNotEmpty, IsNumber, IsString, NotEquals } from "class-validator";

export class UpdateClientDto {
  @IsInt()
  @NotEquals(0)
  clientid: number;

  @IsString()
  @IsNotEmpty()
  clientcode: string;

  @IsString()
  @IsNotEmpty()
  clientname: string;

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

  @IsNumber()
  discount: number;

  @IsString()
  moneytype: string;

  @IsInt()
  useflag: number;

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


  updater: string;
  updatedAt: Date;

  @IsInt()
  clientareaid: number;

  @IsInt()
  operateareaid: number;

  @IsInt()
  currencyid: number;

  @IsInt()
  gs: number;
}