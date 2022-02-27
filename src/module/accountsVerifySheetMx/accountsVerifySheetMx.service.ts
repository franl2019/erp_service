import {Injectable} from "@nestjs/common";
import {AccountsVerifySheetMxEntity} from "./accountsVerifySheetMx.entity";
import {IAccountsVerifySheetMx} from "./accountsVerifySheetMx";
import {AccountsVerifySheetMxFindDto} from "./dto/accountsVerifySheetMxFind.dto";

@Injectable()
export class AccountsVerifySheetMxService {

    constructor(private readonly accountsVerifySheetMxEntity: AccountsVerifySheetMxEntity) {
    }

    public async find(accountsVerifySheetMxFindDto: AccountsVerifySheetMxFindDto) {
        return await this.accountsVerifySheetMxEntity.find(accountsVerifySheetMxFindDto);
    }

    public async create(accountsVerifySheetMxList: IAccountsVerifySheetMx[]) {
        return await this.accountsVerifySheetMxEntity.create(accountsVerifySheetMxList);
    }

    public async delete_data(accountsVerifySheetId: number) {
        return await this.accountsVerifySheetMxEntity.delete_data(accountsVerifySheetId);
    }
}