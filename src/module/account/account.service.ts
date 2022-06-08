import {Injectable} from "@nestjs/common";
import {AccountEntity} from "./account.entity";
import {IAccount} from "./account";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {IState} from "../../interface/IState";
import {FindAccountDto} from "./dto/findAccount.dto";
import {AccountRecordService} from "../accountsRecord/accountRecord.service";

@Injectable()
export class AccountService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountEntity: AccountEntity,
        private readonly accountRecordService: AccountRecordService
    ) {
    }

    public async findAuthByUserId(userid: number) {
        return await this.accountEntity.findAuthByUserId(userid);
    }

    public async findOne(accountId: number) {
        return await this.accountEntity.findOne(accountId);
    }

    public async find(findAccountDto: FindAccountDto) {
        return await this.accountEntity.find(findAccountDto);
    }

    public async create(account: IAccount) {
        return await this.mysqldbAls.sqlTransaction(async () => {

            const createResult = await this.accountEntity.create(account);
            await this.accountRecordService.create({
                accountId: createResult.insertId,
                accountRecordId: 0,
                balanceQty: 0,
                correlationId: 0,
                correlationType: 0,
                createdAt: account.createdAt,
                creater: account.creater,
                creditQty: 0,
                debitQty: 0,
                indate: new Date(null),
                openQty: 0,
                reMark: "",
                relatedNumber: ""
            })
            return createResult
        })
    }

    public async update(account: IAccount, state: IState) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const account_db = await this.accountEntity.findOne(account.accountId);
            account_db.accountCode = account.accountCode;
            account_db.accountName = account.accountName;
            account_db.accountType = account.accountType;
            account_db.companyFlag = account.companyFlag;
            account_db.currencyid = account.currencyid;
            account_db.useFlag = account.useFlag;
            account_db.updater = state.user.username;
            account_db.updatedAt = new Date();
            await this.accountEntity.update(account_db);
        })
    }

    public async delete_data(accountId: number, state: IState) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const account = await this.findOne(accountId);
            if (account.del_uuid !== 0) {
                return Promise.reject(new Error("出纳账户已删除，请不要重复操作"));
            }

            account.del_uuid = account.accountId;
            account.deleter = state.user.username;
            account.deletedAt = new Date();
            await this.accountEntity.delete_data(account);
            await this.accountRecordService.deleteByAccountId(accountId);
        })
    }

    public async unDelete_data(accountId: number) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const account = await this.findOne(accountId);
            if (account.del_uuid === 0) {
                return Promise.reject(new Error("出纳账户未删除，请不要重复操作"));
            }
            await this.accountEntity.delete_data(account)
        })
    }
}