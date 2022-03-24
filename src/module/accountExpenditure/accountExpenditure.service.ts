import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {AccountExpenditureEntity} from "./accountExpenditure.entity";
import {IAccountExpenditure} from "./accountExpenditure";
import {AccountExpenditureFindDto} from "./dto/accountExpenditureFind.dto";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {CodeType} from "../autoCode/codeType";

@Injectable()
export class AccountExpenditureService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly autoCodeMxService: AutoCodeMxService,
        private readonly accountRecordService: AccountRecordService,
        private readonly accountExpenditureEntity: AccountExpenditureEntity
    ) {
    }

    public async findById(accountExpenditureId: number) {
        return await this.accountExpenditureEntity.findById(accountExpenditureId);
    }

    public async find(accountExpenditureFindDto: AccountExpenditureFindDto) {
        return await this.accountExpenditureEntity.find(accountExpenditureFindDto);
    }

    public async create(accountExpenditure: IAccountExpenditure) {
        accountExpenditure.accountExpenditureCode = await this.autoCodeMxService.getAutoCode(CodeType.ZC);
        return await this.accountExpenditureEntity.create(accountExpenditure);
    }

    public async update(accountExpenditure: IAccountExpenditure) {
        const accountExpenditure_db = await this.findById(accountExpenditure.accountExpenditureId);
        if (accountExpenditure_db.level1Review !== 0 && accountExpenditure_db.level2Review !== 0) {
            return Promise.reject(new Error("更新失败，请先撤审此单据"));
        }
        return await this.accountExpenditureEntity.update(accountExpenditure);
    }

    public async level1Review(accountExpenditureId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {

        });
    }

    public async unLevel1Review(accountExpenditureId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {

        });
    }

    public async delete_data(accountExpenditureId: number, userName: string) {

    }
}