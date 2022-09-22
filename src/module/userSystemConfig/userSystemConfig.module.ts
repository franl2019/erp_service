import {Module} from "@nestjs/common";
import {SystemConfigModule} from "../systemConfig/systemConfig.module";
import {UserSystemConfigService} from "./userSystemConfig.service";
import {UserSystemConfigController} from "./userSystemConfig.controller";

@Module({
    imports:[SystemConfigModule],
    controllers:[UserSystemConfigController],
    providers:[UserSystemConfigService],
    exports:[UserSystemConfigService]
})
export class UserSystemConfigModule {}
