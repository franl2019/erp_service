import {Module} from "@nestjs/common";
import {ProductAutoCodeEntity} from "./productAutoCode.entity";
import {ProductAutoCodeService} from "./productAutoCode.service";

@Module({
    providers:[ProductAutoCodeEntity,ProductAutoCodeService],
    exports:[ProductAutoCodeService]
})
export class ProductAutoCodeModule {

}