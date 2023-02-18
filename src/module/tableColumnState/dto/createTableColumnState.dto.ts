import {IsArray, IsBoolean, IsInt, IsNumber, IsString, ValidateIf} from "class-validator";
import {ITableColumnState} from "../tableColumnState";

export class CreateTableColumnStateMxDto implements ITableColumnState {

    @IsString()
    colId: string;

    @IsBoolean()
    editable: boolean;

    @IsBoolean()
    isGroup: boolean;

    @IsString()
    headerClass: string;

    @IsString()
    headerName: string;

    @IsBoolean()
    hide: boolean;

    @IsString()
    parentId: string;

    @ValidateIf((_object, value) => value === null)
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

    @IsInt()
    sn: number;

    @IsString()
    sort: string;

    @IsInt()
    sortIndex: number;

    @IsNumber()
    width: number;

    constructor(tableColumnState:ITableColumnState) {
        this.colId = tableColumnState.colId;
        this.editable = tableColumnState.editable;
        this.isGroup = tableColumnState.isGroup;
        this.headerClass = tableColumnState.headerClass;
        this.headerName = tableColumnState.headerName;
        this.hide = tableColumnState.hide;
        this.parentId = tableColumnState.parentId;
        this.pinned = tableColumnState.pinned;
        this.pivot = tableColumnState.pivot;
        this.pivotIndex = tableColumnState.pivotIndex;
        this.rowGroup = tableColumnState.rowGroup;
        this.rowGroupIndex = tableColumnState.rowGroupIndex;
        this.sn = tableColumnState.sn;
        this.sort = tableColumnState.sort;
        this.sortIndex = tableColumnState.sortIndex;
        this.width = tableColumnState.width;
    }
}

export class CreateTableColumnStateDto {
    @IsString()
    tableName:string;
    @IsArray()
    tableColumnState:ITableColumnState[]
}