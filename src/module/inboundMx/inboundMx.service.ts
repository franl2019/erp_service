import {Injectable} from "@nestjs/common";
import {InboundMxEntity} from "./inboundMx.entity";
import {InboundMxDto} from "./dto/inboundMx.dto";
import {useVerifyParam} from "../../utils/useVerifyParam";
import {IInboundMx} from "./inboundMx";
import {bignumber, chain, round} from "mathjs"
import {ProductService} from "../product/product.service";
import {ClientService} from "../client/client.service";

@Injectable()
export class InboundMxService {

    constructor(
        private readonly productService: ProductService,
        private readonly clientService: ClientService,
        private readonly inboundMxEntity: InboundMxEntity
    ) {
    }

    public async find(inboundid: number) {
        return await this.inboundMxEntity.find(inboundid);
    }

    public async findById(inboundid: number) {
        return await this.inboundMxEntity.findById(inboundid);
    }

    //新增进仓单的明细
    public async create(inboundMxList: IInboundMx[]) {
        const createInboundMxList = await this.getVerifyInboundMxList(inboundMxList)
        return await this.inboundMxEntity.create(createInboundMxList);
    }

    //删除进仓单的明细
    public async delete_date(inboundid: number) {
        return await this.inboundMxEntity.delete_data(inboundid);
    }

    private async checkClient(clientId: number) {
        return await this.clientService.findOne(clientId);
    }

    //计算属性(数量,金额相关)
    private async calculate(inboundMx: IInboundMx) {
        const product = await this.productService.findOne(inboundMx.productid);
        //数量 = 件数 * 包装数量
        inboundMx.inqty =
            round(
                Number(
                    chain(bignumber(inboundMx.bzqty))
                        .multiply(bignumber(product.packqty))
                        .done()
                ), 4)

        switch (inboundMx.pricetype) {
            case 0:
                inboundMx.priceqty = inboundMx.inqty;
                //浮动价？
                inboundMx.netprice = round(
                    Number(
                        chain(bignumber(inboundMx.price))
                            .multiply(bignumber(inboundMx.agio))
                            .multiply(bignumber(inboundMx.agio1))
                            .multiply(bignumber(inboundMx.agio2))
                            .done()
                    ), 4)

                break;
            case 1:
                inboundMx.priceqty = inboundMx.bzqty;
                inboundMx.netprice = round(
                    Number(
                        chain(bignumber(inboundMx.bzprice))
                            .multiply(bignumber(inboundMx.agio))
                            .multiply(bignumber(inboundMx.agio1))
                            .multiply(bignumber(inboundMx.agio2))
                            .done()
                    ), 4)

                break;
            default:
                break;
        }
        return inboundMx
    }

    //获取验证后的数组
    private async getVerifyInboundMxList(inboundMxList: IInboundMx[]): Promise<IInboundMx[]> {
        //验证后的List
        const createInboundMxList: IInboundMx[] = [];
        for (let i = 0; i < inboundMxList.length; i++) {
            const inboundMx = new InboundMxDto(inboundMxList[i]);
            //验证进仓单明细参数类型
            await useVerifyParam(inboundMx);
            await this.checkClient(inboundMx.clientid);
            //计算属性
            await this.calculate(inboundMx);
            createInboundMxList.push(inboundMx);
        }
        return createInboundMxList
    }
}