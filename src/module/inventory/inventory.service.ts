import { Injectable } from "@nestjs/common";
import { MysqldbAls } from "../mysqldb/mysqldbAls";
import { InventoryEntity } from "./inventory.entity";
import { InventoryFindDto } from "./dto/inventoryFind.dto";
import { InventoryEditDto} from "./dto/inventoryEdit.dto";
import {chain, bignumber} from 'mathjs';
import {useVerifyParam} from "../../utils/verifyParam/useVerifyParam";

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
  public async addInventory(inventoryDto: InventoryEditDto) {
    await useVerifyParam(inventoryDto);
    const inventoryDb = await this.inventoryEntity.findOne(inventoryDto);
    if (inventoryDb&&inventoryDb.inventoryid !== 0) {
      //计算库存
      inventoryDb.qty = Number(chain(bignumber(inventoryDb.qty)).add(bignumber(inventoryDto.qty)));
      inventoryDb.updatedAt = inventoryDto.updatedAt;
      inventoryDb.updater = inventoryDto.updater;
      await this.inventoryEntity.update(inventoryDb);
    } else {
      await this.inventoryEntity.create(inventoryDto);
    }
  }

  //减少库存
  public async subtractInventory(inventoryDto: InventoryEditDto) {
    await useVerifyParam(inventoryDto);
    const inventoryDb = await this.inventoryEntity.findOne(inventoryDto);
    if (inventoryDb&&inventoryDb.inventoryid !== 0) {
      //计算库存
      inventoryDb.qty = Number(chain(bignumber(inventoryDb.qty)).subtract(bignumber(inventoryDto.qty)));
      inventoryDb.updatedAt = inventoryDto.updatedAt;
      inventoryDb.updater = inventoryDto.updater;
      await this.inventoryEntity.update(inventoryDb);
    } else {
      await this.inventoryEntity.create(inventoryDto);
    }
  }

}