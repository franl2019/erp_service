import { IsInt } from "class-validator";

export class DeleteCurrencyDto {
  @IsInt()
  currencyid: number;
}