export interface ITableColumnState {
    sn:number;
    colId: string;
    editable: boolean;
    headerName: string;
    hide: boolean;
    pinned: string;
    pivot: boolean;
    pivotIndex: number;
    rowGroup: boolean;
    rowGroupIndex: number;
    sort: string;
    sortIndex: number;
    width: number;
    parentId:string;
    isGroup: boolean;
    headerClass: string;
}