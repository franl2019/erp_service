import {Injectable} from "@nestjs/common";
import {SalesInComeEntity} from "./salesInCome.entity";
import {SalesInComeFindDto} from "./dto/salesInComeFind.dto";
import {ISalesInCome} from "./salesInCome";

@Injectable()
export class SalesInComeService {

    constructor(private readonly salesInComeEntity: SalesInComeEntity) {
    }

    public async find(findDto: SalesInComeFindDto) {
        return await this.salesInComeEntity.find(findDto);
    }

    public async findById(salesInComeId: number) {
        return await this.salesInComeEntity.findById(salesInComeId);
    }

    public async create(salesInCome: ISalesInCome) {
        return await this.salesInComeEntity.create(salesInCome);
    }

    public async update(salesInCome: ISalesInCome) {
        await this.findById(salesInCome.salesInComeId);
        return await this.salesInComeEntity.update(salesInCome);
    }

    public async delete_data(salesInComeId: number, userName: string) {
        await this.findById(salesInComeId);
        return await this.salesInComeEntity.delete_data(salesInComeId, userName);
    }
}