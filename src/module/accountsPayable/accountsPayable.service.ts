import {AccountsPayableEntity} from "./accountsPayable.entity";
import {AccountsPayableFindDto} from "./dto/accountsPayableFind.dto";
import {IAccountsPayable} from "./accountsPayable";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {bignumber, chain, round} from 'mathjs';

export class AccountsPayableService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly accountsPayableEntity: AccountsPayableEntity,
    ) {
    }

    public async findById(accountsPayableId: number) {
        return await this.accountsPayableEntity.findById(accountsPayableId);
    }

    public async find(findDto: AccountsPayableFindDto) {
        return await this.accountsPayableEntity.find(findDto);
    }

    public async create(accountsPayable: IAccountsPayable) {
        return await this.accountsPayableEntity.create(accountsPayable);
    }

    //增加已核销金额
    public async increaseWriteOffAmount(accountsPayableId: number, thisWriteOffAmount: number) {
        if (thisWriteOffAmount && thisWriteOffAmount <= 0) {
            return Promise.reject(new Error('本次核销金额不能小于或等于0'));
        }

        return await this.mysqldbAls.sqlTransaction(async () => {
            const accountsPayable = await this.findById(accountsPayableId);
            //已核销金额
            const checkedAmounts: number = Number(
                round(
                    chain(bignumber(accountsPayable.checkedAmounts))
                        .add(bignumber(thisWriteOffAmount))
                        .done()
                    , 4)
            );

            //未核销金额
            const notCheckAmounts: number = Number(
                round(
                    chain(bignumber(accountsPayable.amounts))
                        .subtract(bignumber(checkedAmounts))
                        .done()
                    , 4)
            );

            accountsPayable.checkedAmounts = checkedAmounts;
            accountsPayable.notCheckAmounts = notCheckAmounts;
            return await this.accountsPayableEntity.update(accountsPayable);
        })
    }

    //减少已核销金额
    public async reduceWriteOffAmount(accountsPayableId: number, thisCancelWriteOffAmount: number) {
        if (thisCancelWriteOffAmount) {
            return Promise.reject(new Error('本次核销金额不能等于0'));
        }


        return await this.mysqldbAls.sqlTransaction(async () => {
            const accountsPayable = await this.findById(accountsPayableId);
            //已核销金额
            const checkedAmounts: number = Number(
                round(
                    chain(bignumber(accountsPayable.checkedAmounts))
                        .subtract(bignumber(thisCancelWriteOffAmount))
                        .done(), 4)
            );
            //未核销金额
            const notCheckAmounts: number = Number(
                round(
                    chain(bignumber(accountsPayable.amounts))
                        .subtract(bignumber(checkedAmounts))
                        .done()
                    , 4)
            )

            accountsPayable.checkedAmounts = checkedAmounts;
            accountsPayable.notCheckAmounts = notCheckAmounts;
            return await this.accountsPayableEntity.update(accountsPayable);
        })
    }

    public async delete_data(accountsPayableId: number, userName: string) {
        return await this.accountsPayableEntity.delete_data(accountsPayableId, userName);
    }
}