import {Injectable} from "@nestjs/common";
import {OutboundMxEntity} from "./outboundMx.entity";
import {IOutboundMx} from "./outboundMx";
import {CreateOutboundDto} from "./dto/createOutbound.dto";
import {verifyParam} from "../../utils/verifyParam";
import {ProductService} from "../product/product.service";
import {bignumber, chain, round} from "mathjs";
import {WarehouseService} from "../warehouse/warehouse.service";
import {ClientService} from "../client/client.service";

@Injectable()
export class OutboundMxService {

    constructor(
        private readonly outboundMxEntity: OutboundMxEntity,
        private readonly productService: ProductService,
        private readonly warehouseService: WarehouseService,
        private readonly clientService: ClientService,
    ) {
    }

    private async checkClient(clientId: number) {
        return await this.clientService.findOne(clientId);
    }

    private async checkWarehouse(warehouseId: number) {
        return await this.warehouseService.findOne(warehouseId);
    }

    //计算明细(数量，单价相关)
    private async calculate(outboundMx: IOutboundMx) {
        const product = await this.productService.findOne(outboundMx.productid);
        outboundMx.outqty = Number(
            round(chain(bignumber(outboundMx.bzqty))
                .multiply(bignumber(product.packqty))
                .done(), 4)
        );

        switch (outboundMx.pricetype) {
            case 0:
                outboundMx.priceqty = outboundMx.outqty;
                outboundMx.netprice = Number(
                    round(
                        chain(bignumber(outboundMx.price))
                            .multiply(bignumber(outboundMx.agio))
                            .multiply(bignumber(outboundMx.agio1))
                            .multiply(bignumber(outboundMx.agio2))
                            .add(bignumber(outboundMx.floatprice1))
                            .add(bignumber(outboundMx.floatprice2))
                            .add(bignumber(outboundMx.floatprice3))
                            .done()
                        , 4)
                )
                break;
            case 1:
                outboundMx.priceqty = outboundMx.bzqty;
                outboundMx.netprice = Number(
                    round(
                        chain(bignumber(outboundMx.bzprice))
                            .multiply(bignumber(outboundMx.agio))
                            .multiply(bignumber(outboundMx.agio1))
                            .multiply(bignumber(outboundMx.agio2))
                            .add(bignumber(outboundMx.floatprice1))
                            .add(bignumber(outboundMx.floatprice2))
                            .add(bignumber(outboundMx.floatprice3))
                            .done()
                        , 4)
                )
                break;
            default:
                break;
        }

        return outboundMx
    }

    private async getVerifiedOutboundMxList(outboundMxList: IOutboundMx[]): Promise<IOutboundMx[]> {
        const verifiedOutboundMxList: IOutboundMx[] = []
        for (let i = 0; i < outboundMxList.length; i++) {
            const outboundMx = new CreateOutboundDto(outboundMxList[i]);
            await verifyParam(outboundMx);
            await this.checkWarehouse(outboundMx.warehouseid);
            await this.checkClient(outboundMx.clientid);
            await this.calculate(outboundMx);
            verifiedOutboundMxList.push(outboundMx);
        }
        return verifiedOutboundMxList
    }

    //查询出仓单明细
    public async find(outboundId: number) {
        return await this.outboundMxEntity.find(outboundId);
    }

    //查询出仓单明细_实例
    public async findById(outboundId: number) {
        return await this.outboundMxEntity.find_entity(outboundId);
    }

    //增加出仓单明细
    public async create(outboundMxList: IOutboundMx[]) {
        const verifiedOutboundMxList = await this.getVerifiedOutboundMxList(outboundMxList)
        return await this.outboundMxEntity.create(verifiedOutboundMxList);
    }

    //删除出仓单明细
    public async delete_data(outboundId: number) {
        return await this.outboundMxEntity.delete_data(outboundId);
    }
}