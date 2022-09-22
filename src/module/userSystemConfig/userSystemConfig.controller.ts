import {Controller} from "@nestjs/common";
import {UserSystemConfigService} from "./userSystemConfig.service";

@Controller('erp/userSystemConfig')
export class UserSystemConfigController {

    constructor(
        private readonly userSystemConfigService:UserSystemConfigService
    ) {
    }


}