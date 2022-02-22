import { IsInt, IsString } from "class-validator";

export class SelectClientDto {
  operateareaids: number[];

  @IsInt()
  clientareaid: number;

  @IsString()
  search: string;

  @IsInt()
  page: number;

  @IsInt()
  pagesize: number;

  @IsInt()
  useflag:number;
}