import {Module} from "@nestjs/common";
import {ClientAutoCodeEntity} from "./clientAutoCode.entity";
import {ClientAutoCodeService} from "./clientAutoCode.service";

@Module({
    providers:[ClientAutoCodeEntity,ClientAutoCodeService],
    exports:[ClientAutoCodeService]
})
export class ClientAutoCodeModule {
}