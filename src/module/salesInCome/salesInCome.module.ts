import {Module} from "@nestjs/common";
import {SalesInComeController} from "./salesInCome.controller";
import {SalesInComeService} from "./salesInCome.service";
import {SalesInComeEntity} from "./salesInCome.entity";
import {MysqldbModule} from "../mysqldb/mysqldb.module";

@Module({
    imports:[MysqldbModule],
    controllers:[SalesInComeController],
    providers:[SalesInComeService,SalesInComeEntity],
    exports:[SalesInComeService]
})
export class SalesInComeModule {
}