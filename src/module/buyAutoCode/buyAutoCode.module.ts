import {Module} from "@nestjs/common";
import {BuyAutoCodeEntity} from "./buyAutoCode.entity";
import {BuyAutoCodeService} from "./buyAutoCode.service";

@Module({
    providers:[BuyAutoCodeEntity,BuyAutoCodeService],
    exports:[BuyAutoCodeService]
})
export class BuyAutoCodeModule {

}