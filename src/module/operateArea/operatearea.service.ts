import { Injectable } from "@nestjs/common";
import { OperateareaSql } from "./operatearea.sql";
import { AddOperateAreaDto } from "./dto/addOperateArea.dto";
import { UpdateOperateAreaDto } from "./dto/updateOperateArea.dto";
import { DeleteOperateAreaDto } from "./dto/deleteOperateArea.dto";
import { SelectOperateAreaDto } from "./dto/selectOperateArea.dto";

@Injectable()
export class OperateareaService {

  constructor(private readonly operateareaSql: OperateareaSql) {
  }

  //搜索操作区域资料
  public async select(selectDto: SelectOperateAreaDto) {
    return await this.operateareaSql.getOperateAreas(selectDto);
  }

  //搜索已删除操作区域
  public async unselect() {
    return await this.operateareaSql.getDeletedOperateAreas();
  }

  public async findDefaultOperateArea(operateareatype: number) {
    if (operateareatype === 0) {
      return this.operateareaSql.getClientPublicOperateArea();
    } else if (operateareatype === 1) {
      return this.operateareaSql.getBuyPublicOperateArea();
    }
  }

  //新增操作区域资料
  public async add(addDto: AddOperateAreaDto) {
    return await this.operateareaSql.add(addDto);
  }

  //更新操作区域资料
  public async update(updateDto: UpdateOperateAreaDto) {
    return await this.operateareaSql.update(updateDto);
  }

  //删除操作区域资料
  public async delete_data(deleteDto: DeleteOperateAreaDto) {
    return await this.operateareaSql.delete_data(deleteDto);
  }

  //取消删除操作区域资料
  public async undelete(deleteDto: DeleteOperateAreaDto) {
    deleteDto.del_uuid = 0;
    deleteDto.deletedAt = null;
    deleteDto.deleter = null;
    return await this.operateareaSql.undelete(deleteDto);
  }
}
