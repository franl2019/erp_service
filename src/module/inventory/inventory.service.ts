import {Injectable} from "@nestjs/common";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {InventoryEntity} from "./inventory.entity";
import {InventoryFindDto} from "./dto/inventoryFind.dto";
import {InventoryEditDto} from "./dto/inventoryEdit.dto";
import {OutboundSheet} from "../outbound/outbound";
import {InventoryFindOneDto} from "./dto/inventoryFindOne.dto";

@Injectable()
export class InventoryService {
    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly inventoryEntity: InventoryEntity
    ) {
    }

    //查询库存
    public async find(selectDto: InventoryFindDto) {
        return await this.inventoryEntity.find(selectDto);
    }

    //增加库存
    public async addInventory(inventoryFindOneDto: InventoryFindOneDto, qty: number, userName: string) {
        const editInventory = await new InventoryEditDto().setValue(
            await this.inventoryEntity.findOne(inventoryFindOneDto)
        )

        await editInventory.add(qty, userName);
        if (editInventory && editInventory.inventoryid !== 0) {
            await this.inventoryEntity.update(editInventory);
        } else {
            await this.inventoryEntity.create(editInventory);
        }
    }

    //减少库存
    public async subtractInventory(inventoryFindOneDto: InventoryFindOneDto, qty: number, userName: string) {
        const editInventory = await new InventoryEditDto().setValue(
            await this.inventoryEntity.findOne(inventoryFindOneDto)
        )
        await editInventory.subtract(qty, userName);
        if (editInventory && editInventory.inventoryid !== 0) {
            await this.inventoryEntity.update(editInventory);
        } else {
            await this.inventoryEntity.create(editInventory);
        }
    }

    //销售单减少库存
    public async outboundSheetSubtractInventory(outboundSheet: OutboundSheet, userName: string) {
        //获取需要进仓的明细
        const outboundMxList = outboundSheet.outboundMx;
        for (let i = 0; i < outboundMxList.length; i++) {
            const outboundMx = outboundMxList[i];
            const inventoryFindDto = new InventoryFindOneDto().useOutboundMxFindInventory(outboundMx);
            await this.subtractInventory(inventoryFindDto,outboundMx.outqty,userName);
        }
    }

    //销售单增加库存
    public async outboundSheetAddInventory(outboundSheet: OutboundSheet, userName: string) {
        //获取需要进仓的明细
        const outboundMxList = outboundSheet.outboundMx;
        for (let i = 0; i < outboundMxList.length; i++) {
            const outboundMx = outboundMxList[i];
            const inventoryFindDto = new InventoryFindOneDto().useOutboundMxFindInventory(outboundMx);
            await this.addInventory(inventoryFindDto,outboundMx.outqty,userName);
        }
    }
}