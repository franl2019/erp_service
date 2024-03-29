import {Global, Module} from "@nestjs/common";
import {SystemConfigHeadService} from "./systemConfigHead/systemConfigHead.service";
import {SystemConfigHeadEntity} from "./systemConfigHead/systemConfigHead.entity";
import {SystemConfigMxEntity} from "./systemConfigMx/systemConfigMx.entity";
import {SystemConfigMxService} from "./systemConfigMx/systemConfigMx.service";
import {SystemConfigOptionEntity} from "./systemConfigOption/systemConfigOption.entity";
import {SystemConfigOptionService} from "./systemConfigOption/systemConfigOption.service";
import {SystemConfigService} from "./systemConfig.service";
import {SystemConfigOptionMxService} from "./systemConfigOptionMx/systemConfigOptionMx.service";
import {SystemConfigOptionMxEntity} from "./systemConfigOptionMx/systemConfigOptionMx.entity";

@Global()
@Module({
    providers:[
        SystemConfigHeadEntity,
        SystemConfigHeadService,

        SystemConfigMxEntity,
        SystemConfigMxService,

        SystemConfigOptionEntity,
        SystemConfigOptionService,

        SystemConfigOptionMxEntity,
        SystemConfigOptionMxService,

        SystemConfigService,
    ],
    exports:[
        SystemConfigService
    ]
})
export class SystemConfigModule {

}