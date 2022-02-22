import {Injectable} from "@nestjs/common";
import {CurrencyEntity} from "./currency.entity";
import {AddCurrencyDto} from "./dto/addCurrency.dto";
import {UpdateCurrencyDto} from "./dto/updateCurrency.dto";
import {DeleteCurrencyDto} from "./dto/deleteCurrency.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";

@Injectable()
export class CurrencyService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly currencyEntity: CurrencyEntity) {
    }

    public async select() {
        return await this.currencyEntity.getCurrencys();
    }

    public async unSelect() {
        return await this.currencyEntity.getDeletedCurrencys();
    }

    public async add(currency: AddCurrencyDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            if (currency.standardmoneyflag === 1) {
                const currency_db = await this.currencyEntity.getStandardMoney();
                if (currency_db) {
                    await Promise.reject(new Error("本位币存在，无法重复新增本位币"));
                }
            }
            return await this.currencyEntity.create(currency);
        });
    }

    public async update(currency: UpdateCurrencyDto) {
        return await this.mysqldbAls.sqlTransaction(async () => {
            const currency_db = await this.currencyEntity.getStandardMoney();
            if (currency.standardmoneyflag === 1 && currency_db.currencyid !== currency.currencyid) {
                return Promise.reject(new Error("本位币存在，无法重复保存本位币"));
            }
            return await this.currencyEntity.update(currency);
        });
    }

    public async delete_data(currency: DeleteCurrencyDto,userName:string) {
        return await this.currencyEntity.delete_data(currency,userName);
    }

    public async undelete(currency: DeleteCurrencyDto) {
        return await this.currencyEntity.unDelete_data(currency);
    }
}