import { IsInt } from "class-validator";

export class AccountRecordUpdateDto {
  @IsInt()
  accountId:number;
  startDate:string;
  endDate:string;
}