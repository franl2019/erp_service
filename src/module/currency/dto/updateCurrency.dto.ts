import { IsInt, IsString } from "class-validator";
import {ICurrency} from "../ICurrency";

export class UpdateCurrencyDto implements ICurrency{
  @IsInt()
  currencyid: number;

  @IsString()
  currencyname: string;

  @IsInt()
  standardmoneyflag: number;

  updater: string;
  updatedAt: Date;
  createdAt: Date;
  creater: string;
  del_uuid: number;
  deletedAt: Date;
  deleter: string;
}