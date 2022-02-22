import { Injectable } from "@nestjs/common";
import { AutoCodeEntity } from "./autoCode.entity";
import { AutoCode } from "./autoCode";

@Injectable()
export class AutoCodeService {

  constructor(
    private readonly autocodeEntity: AutoCodeEntity
  ) {
  }

  public async select() {
    return await this.autocodeEntity.getInboundAutoCodes();
  }

  public async update(autoCode: AutoCode) {
    return await this.autocodeEntity.update(autoCode);
  }

  //获取自动单号代号
  public async getAutoCodeName(codeType: number): Promise<string> {
    const autoCode = await this.autocodeEntity.getInboundAutoCode(codeType);
    if (autoCode.codeName.length === 0) {
      return Promise.reject(new Error("此单据类型，单据编号为空"));
    }
    return autoCode.codeName;
  }
}