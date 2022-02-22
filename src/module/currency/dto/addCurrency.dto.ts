import { IsInt, IsString } from "class-validator";
import {ICurrency} from "../ICurrency";

export class AddCurrencyDto implements ICurrency{
  @IsString()
  currencyname: string;

  @IsInt()
  standardmoneyflag: number;

  creater: string;
  createdAt: Date;
  currencyid: number;
  del_uuid: number;
  deletedAt: Date;
  deleter: string;
  updatedAt: Date;
  updater: string;
}