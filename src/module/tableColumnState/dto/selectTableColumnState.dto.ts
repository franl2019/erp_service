import { IsString } from "class-validator";

export class SelectTableColumnStateDto {
  @IsString()
  tableName:string;
}