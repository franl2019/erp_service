import {AccountsReceivableEntity} from "./accountsReceivable.entity";
import {AccountsReceivableFindDto} from "./dto/accountsReceivableFind.dto";
import {IAccountsReceivable} from "./accountsReceivable";
import {bignumber, chain, round} from "mathjs";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

export class AccountsReceivableService {

    constructor(
        private readonly accountsReceivableEntity: AccountsReceivableEntity,
        private readonly mysqldbAls: MysqldbAls,
    ) {
    }

    public async findById(accountsReceivableId: number) {
        return await this.accountsReceivableEntity.findById(accountsReceivableId);
    }

    public async find(findDto: AccountsReceivableFindDto) {
        return await this.accountsReceivableEntity.find(findDto);
    }

    public async create(accountsReceivable: IAccountsReceivable) {
        return await this.accountsReceivableEntity.create(accountsReceivable);
    }

    public async delete_data(accountsReceivableId: number, userName: string) {
        return await this.accountsReceivableEntity.delete_data(accountsReceivableId, userName);
    }

    //增加已核销金额
    public async increaseWriteOffAmount(accountsReceivableId: number, thisWriteOffAmount: number) {
        if (thisWriteOffAmount && thisWriteOffAmount <= 0) {
            return Promise.reject(new Error('本次核销金额不能小于或等于0'));
        }

        return await this.mysqldbAls.sqlTransaction(async () => {
            const accountsReceivable = await this.findById(accountsReceivableId);
            //已核销金额
            const checkedAmounts: number = Number(
                round(
                    chain(bignumber(accountsReceivable.checkedAmounts))
                        .add(bignumber(thisWriteOffAmount))
                        .done()
                    , 4)
            );

            //未核销金额
            const notCheckAmounts: number = Number(
                round(
                    chain(bignumber(accountsReceivable.amounts))
                        .subtract(bignumber(checkedAmounts))
                        .done()
                    , 4)
            );

            accountsReceivable.checkedAmounts = checkedAmounts;
            accountsReceivable.notCheckAmounts = notCheckAmounts;
            return await this.accountsReceivableEntity.update(accountsReceivable);
        })
    }

    //减少已核销金额
    public async reduceWriteOffAmount(accountsReceivableId: number, thisCancelWriteOffAmount: number) {
        if (thisCancelWriteOffAmount) {
            return Promise.reject(new Error('本次核销金额不能等于0'));
        }


        return await this.mysqldbAls.sqlTransaction(async () => {
            const accountsReceivable = await this.findById(accountsReceivableId);
            //已核销金额
            const checkedAmounts: number = Number(
                round(
                    chain(bignumber(accountsReceivable.checkedAmounts))
                        .subtract(bignumber(thisCancelWriteOffAmount))
                        .done(), 4)
            );
            //未核销金额
            const notCheckAmounts: number = Number(
                round(
                    chain(bignumber(accountsReceivable.amounts))
                        .subtract(bignumber(checkedAmounts))
                        .done()
                    , 4)
            )

            accountsReceivable.checkedAmounts = checkedAmounts;
            accountsReceivable.notCheckAmounts = notCheckAmounts;
            return await this.accountsReceivableEntity.update(accountsReceivable);
        })
    }

    public async deleteById(accountsReceivableId: number, userName: string) {
        return await this.accountsReceivableEntity.delete_data(accountsReceivableId, userName);
    }
}