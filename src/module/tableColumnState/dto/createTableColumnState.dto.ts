import { IColumnState } from "../tableColumnState.entity";
import { IsArray, IsBoolean, IsInt, IsString } from "class-validator";

export class CreateTableColumnStateMxDto implements IColumnState {
  sn:number;

  @IsString()
  tableName: string;

  @IsString()
  aggFunc: string;

  @IsString()
  colId: string;

  @IsInt()
  flex: number;

  @IsBoolean()
  hide: boolean;

  @IsString()
  pinned: string;

  @IsBoolean()
  pivot: boolean;

  @IsInt()
  pivotIndex: number;

  @IsBoolean()
  rowGroup: boolean;

  @IsInt()
  rowGroupIndex: number;

  @IsString()
  sort: string;

  @IsInt()
  sortIndex: number;

  @IsInt()
  width: number;

}

export class CreateTableColumnStateDto {
  @IsString()
  tableName:string

  @IsArray()
  tableColumnState:CreateTableColumnStateMxDto[]
}