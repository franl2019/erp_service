import { Body, Controller, Post } from "@nestjs/common";
import { SelectTableColumnStateDto } from "./dto/selectTableColumnState.dto";
import { TableColumnStateService } from "./tableColumnState.service";
import { CreateTableColumnStateDto } from "./dto/createTableColumnState.dto";

@Controller("erp/table_column_state")
export class TableColumnStateController {

  constructor(private readonly tableColumnStateService: TableColumnStateService) {
  }

  @Post("select")
  public async select(@Body() selectDto: SelectTableColumnStateDto) {
    const data = await this.tableColumnStateService.select(selectDto.tableName);
    return {
      code: 200,
      msg: "查询成功",
      data
    };
  }

  @Post("add")
  public async add(@Body() addDto: CreateTableColumnStateDto) {
    await this.tableColumnStateService.add(addDto.tableName, addDto.tableColumnState);
    return {
      code: 200,
      msg: "保存成功"
    };
  }

  @Post("delete_data")
  public async deleteData(@Body() addDto: SelectTableColumnStateDto) {
    await this.tableColumnStateService.deleteData(addDto.tableName);
    return {
      code: 200,
      msg: "保存成功"
    };
  }
}