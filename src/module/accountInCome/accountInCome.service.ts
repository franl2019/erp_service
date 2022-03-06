import {Injectable} from "@nestjs/common";
import {AccountInComeEntity} from "./accountInCome.entity";
import {AccountInComeFindDto} from "./dto/accountInComeFind.dto";
import {IAccountInCome} from "./accountInCome";
import {AutoCodeMxService} from "../autoCodeMx/autoCodeMx.service";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class AccountInComeService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountInComeEntity: AccountInComeEntity,
        private readonly autoCodeMxService: AutoCodeMxService
    ) {
    }

    public async find(accountInComeFindDto: AccountInComeFindDto) {
        return await this.accountInComeEntity.find(accountInComeFindDto);
    }

    public async findById(accountInComeId: number) {
        return await this.accountInComeEntity.findById(accountInComeId);
    }

    public async create(accountInCome: IAccountInCome) {
        return this.mysqldbAls.sqlTransaction(async () => {
            accountInCome.accountInComeCode = await this.autoCodeMxService.getAutoCode(19);
            return await this.accountInComeEntity.create(accountInCome);
        })
    }

    public async update(accountInCome: IAccountInCome) {
        await this.findById(accountInCome.accountInComeId);
        return await this.accountInComeEntity.update(accountInCome);
    }

    public async delete_data(accountInComeId: number, userName: string) {
        await this.findById(accountInComeId);
        return await this.accountInComeEntity.delete_data(accountInComeId, userName);
    }

    public async level1Review(accountInComeId: number, userName: string) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            await this.accountInComeEntity.level1Review(accountInComeId, userName);

            // await this.accountRecordService.create(accountRecord);
            // await this.accountRecordService.countAccountQty(accountRecord.accountId);
        })
    }

    public async unLevel1Review(accountInComeId: number) {
        return this.mysqldbAls.sqlTransaction(async () => {
            const accountInCome = await this.findById(accountInComeId);
            await this.accountInComeEntity.unLevel1Review(accountInComeId);
            // await this.accountRecordService.delete_data(accountInComeId, 0);
            // await this.accountRecordService.countAccountQty(accountInCome.accountId);
        })
    }
}