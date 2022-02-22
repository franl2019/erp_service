import { IsInt, IsString } from "class-validator";

export class SelectBuyDto {
  operateareaids: number[];

  @IsInt()
  buyareaid: number;

  @IsString()
  search: string;

  @IsInt()
  page: number;

  @IsInt()
  pagesize: number;

  @IsInt()
  useflag:number;
}