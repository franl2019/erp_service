import {Module} from "@nestjs/common";
import {AutoCodeMxEntity} from "./autoCodeMx.entity";
import {AutoCodeMxService} from "./autoCodeMx.service";
import {AutoCodeModule} from "../autoCode/autoCode.module";
import {BuyAreaModule} from "../buyArea/buyArea.module";

@Module({
    imports: [
        AutoCodeModule,
        BuyAreaModule
    ],
    providers: [AutoCodeMxEntity, AutoCodeMxService],
    exports: [AutoCodeMxService]
})
export class AutoCodeMxModule {}