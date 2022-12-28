import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {TableColumnStateEntity} from "./tableColumnState.entity";
import {CreateTableColumnStateMxDto} from "./dto/createTableColumnState.dto";
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";
import {ITableColumnState} from "./tableColumnState";

@Injectable()
export class TableColumnStateService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly tableColumnStateEntity: TableColumnStateEntity
    ) {
    }

    public async select(tableName: string) {
        return await this.tableColumnStateEntity.find(tableName);
    }

    public async add(tableName: string, addDto: ITableColumnState[]) {
        await this.tableColumnStateEntity.deleteData(tableName);
        const createDtoList: ITableColumnState[] = []
        for (let i = 0; i < addDto.length; i++) {
            const createDto = new CreateTableColumnStateMxDto(addDto[i]);
            await useVerifyParam(createDto);
            createDtoList.push(createDto);
        }
        await this.tableColumnStateEntity.create(createDtoList,tableName);
    }

    public async deleteData(addTablename: string) {
        await this.tableColumnStateEntity.deleteData(addTablename);
    }
}