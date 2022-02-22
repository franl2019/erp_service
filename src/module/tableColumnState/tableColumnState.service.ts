import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { IColumnState, TableColumnStateEntity } from "./tableColumnState.entity";
import { CreateTableColumnStateMxDto } from "./dto/createTableColumnState.dto";
import { verifyParam } from "../../utils/verifyParam";

@Injectable()
export class TableColumnStateService {

  constructor(
    private readonly mysqldbAls: MysqldbAls,
    private readonly tableColumnStateEntity: TableColumnStateEntity
  ) {
  }

  public async select(tableName: string) {
    const data = await this.tableColumnStateEntity.find(tableName);
    for (let i = 0; i < data.length; i++) {
      delete data[i].tableName;
      data[i].aggFunc = data[i].aggFunc ? data[i].aggFunc : null;
      data[i].flex = data[i].flex ? data[i].flex : null;
      data[i].pinned = data[i].pinned ? data[i].pinned : null;
      data[i].pivotIndex = data[i].pivotIndex ? data[i].pivotIndex : null;
      data[i].rowGroupIndex = data[i].rowGroupIndex ? data[i].rowGroupIndex : null;
      data[i].sort = data[i].sort ? data[i].sort : null;
      data[i].sortIndex = data[i].sortIndex ? data[i].sortIndex : null;
    }
    return data;
  }

  public async add(addTablename: string, addDto: IColumnState[]) {
    await this.tableColumnStateEntity.deleteData(addTablename);
    for (let i = 0; i < addDto.length; i++) {
      const createDto = new CreateTableColumnStateMxDto();
      createDto.sn = i;
      createDto.tableName = addTablename;
      createDto.aggFunc = addDto[i].aggFunc ? addDto[i].aggFunc : "";
      createDto.colId = addDto[i].colId;
      createDto.flex = addDto[i].flex ? addDto[i].flex : 0;
      createDto.hide = addDto[i].hide;
      createDto.pinned = addDto[i].pinned ? addDto[i].pinned : "";
      createDto.pivot = addDto[i].pivot;
      createDto.pivotIndex = addDto[i].pivotIndex ? addDto[i].pivotIndex : 0;
      createDto.rowGroup = addDto[i].rowGroup;
      createDto.rowGroupIndex = addDto[i].rowGroupIndex ? addDto[i].rowGroupIndex : 0;
      createDto.sort = addDto[i].sort ? addDto[i].sort : "";
      createDto.sortIndex = addDto[i].sortIndex ? addDto[i].sortIndex : 0;
      createDto.width = addDto[i].width;
      await verifyParam(createDto);
      await this.tableColumnStateEntity.create(createDto);
    }
  }

  public async deleteData(addTablename: string) {
    await this.tableColumnStateEntity.deleteData(addTablename);
  }
}