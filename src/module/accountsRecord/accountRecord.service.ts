import {Injectable} from "@nestjs/common";
import {AccountRecordEntity} from "./accountRecord.entity";
import {IAccountRecordFindDto} from "./dto/accountRecordFind.dto";
import {IAccountRecord} from "./accountRecord";
import {CodeType} from "../autoCode/codeType";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class AccountRecordService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountRecordEntity: AccountRecordEntity
    ) {
    }

    public async findById(accountRecordId: number) {
        return await this.accountRecordEntity.findById(accountRecordId);
    }

    public async find(findDto: IAccountRecordFindDto) {
        return await this.accountRecordEntity.find(findDto);
    }

    public async create(accountRecord: IAccountRecord) {
        return await this.accountRecordEntity.create(accountRecord);
    }

    public async countAccountQty(accountId: number) {
        return await this.accountRecordEntity.countAccountQty(accountId);
    }

    public async deleteByAccountId(accountId:number){
        return await this.accountRecordEntity.deleteByAccountId(accountId);
    }

    public async deleteByCorrelation(correlationId: number, type: CodeType.accountInCome | CodeType.accountExpenditure) {
        return await this.accountRecordEntity.deleteByCorrelation(correlationId, type);
    }
}