import {Module} from "@nestjs/common";
import {SystemConfigModule} from "../systemConfig/systemConfig.module";
import {UserSystemConfigService} from "./userSystemConfig.service";

@Module({
    imports:[SystemConfigModule],
    providers:[UserSystemConfigService],
    exports:[UserSystemConfigService]
})
export class UserSystemConfigModule {}
