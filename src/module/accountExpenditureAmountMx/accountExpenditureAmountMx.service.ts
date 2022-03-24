import {Injectable} from "@nestjs/common";
import {AccountExpenditureAmountMxEntity} from "./accountExpenditureAmountMx.entity";
import {IAccountExpenditureAmountMx} from "./accountExpenditureAmountMx";

@Injectable()
export class AccountExpenditureAmountMxService {

    constructor(
        private readonly accountExpenditureAmountMxEntity:AccountExpenditureAmountMxEntity,
    ) {
    }

    public async findById(accountExpenditureId:number){
        await this.accountExpenditureAmountMxEntity.findById(accountExpenditureId);
    }

    public async create(accountExpenditureAmountMx: IAccountExpenditureAmountMx){
        await this.accountExpenditureAmountMxEntity.create(accountExpenditureAmountMx)
    }

    public async deleteById(accountExpenditureId:number){
        await this.accountExpenditureAmountMxEntity.deleteById(accountExpenditureId);
    }
}