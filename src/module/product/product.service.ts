import {Injectable} from "@nestjs/common";
import {ProductEntity} from "./product.entity";
import {SelectProductDto} from "./dto/selectProduct.dto";
import {UpdateProductDto} from "./dto/updateProduct.dto";
import {AddProductDto} from "./dto/addProduct.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ProductAreaService} from "../productArea/productArea.service";
import {ProductAutoCodeService} from "../productAutoCode/productAutoCode.service";
import {IState} from "../../decorator/user.decorator";
import {ProductOtherUnitMxService} from "../productOtherUnitMx/productOtherUnitMx.service";


@Injectable()
export class ProductService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly productAreaService: ProductAreaService,
        private readonly productAutoCodeService: ProductAutoCodeService,
        private readonly productEntity: ProductEntity,
        private readonly productOtherUnitMxService: ProductOtherUnitMxService
    ) {
    }

    public async findOne(productId: number) {
        return await this.productEntity.findOne(productId);
    }

    public async find(product: SelectProductDto, state: IState) {
        if (product.warehouseids.length === 0) product.warehouseids = state.user.warehouseids;
        return await this.productEntity.find(product);
    }

    public async create(addProductDto: AddProductDto, state: IState): Promise<{ id: number, code: string }> {
        addProductDto.creater = state.user.username;
        addProductDto.createdAt = new Date();

        if (state.user.warehouseids.indexOf(addProductDto.warehouseid) === -1) {
            await Promise.reject(new Error("缺少该仓库权限,保存失败"));
        }

        return await this.mysqldbAls.sqlTransaction(async () => {
            const productArea = await this.productAreaService.findOne(addProductDto.productareaid);

            if (addProductDto.productcode.length === 0) {
                addProductDto.productcode = await this.productAutoCodeService.getProductAutoCode(productArea.parentCode)
            }

            const result = await this.productEntity.create(addProductDto);

            //创建辅助单位明细
            if (addProductDto.productOtherUnitMxList.length > 0) {
                const productOtherUnitMxList = addProductDto.productOtherUnitMxList;
                for (let i = 0; i < productOtherUnitMxList.length; i++) {
                    const productOtherUnitMx = productOtherUnitMxList[i];
                    if (
                        productOtherUnitMx.conversionRate !== 0
                    ) {
                        productOtherUnitMx.productid = result.insertId;
                        productOtherUnitMx.creater = state.user.username;
                        productOtherUnitMx.createdAt = new Date();
                        await this.productOtherUnitMxService.create(productOtherUnitMx);
                    }
                }
            }

            return {
                id: result.insertId,
                code: addProductDto.productcode
            }
        })
    }

    public async update(updateProductDto: UpdateProductDto, state: IState) {

        updateProductDto.updater = state.user.username;
        updateProductDto.updatedAt = new Date();

        return await this.mysqldbAls.sqlTransaction(async () => {
            const product_DB = await this.productEntity.findOne(updateProductDto.productid);
            //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
            if (state.user.warehouseids.indexOf(product_DB.warehouseid) === -1 || state.user.warehouseids.indexOf(updateProductDto.warehouseid) === -1) {
                await Promise.reject(new Error("缺少该仓库权限,更新失败"));
            }

            await this.productEntity.update(updateProductDto);

            //创建辅助单位明细
            if (updateProductDto.productOtherUnitMxList.length > 0) {
                const productOtherUnitMxList_db = await this.productOtherUnitMxService.find(updateProductDto.productid);


                if (productOtherUnitMxList_db.length !== 0) {
                    await this.productOtherUnitMxService.delete_data(updateProductDto.productid)
                }

                const productOtherUnitMxList = updateProductDto.productOtherUnitMxList;
                for (let i = 0; i < productOtherUnitMxList.length; i++) {
                    const productOtherUnitMx = productOtherUnitMxList[i];
                    if(
                        productOtherUnitMx.conversionRate !== 0
                    ){
                        productOtherUnitMx.productid = updateProductDto.productid;
                        productOtherUnitMx.creater = state.user.username;
                        productOtherUnitMx.createdAt = new Date();
                        await this.productOtherUnitMxService.create(productOtherUnitMx);
                    }
                }
            }
        });
    }

    public async delete_data(productid: number, state: IState) {
        const product_DB = await this.productEntity.findOne(productid);
        //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
        if (state.user.warehouseids.indexOf(product_DB.warehouseid) === -1) {
            await Promise.reject(new Error("缺少该仓库权限,更新失败"));
        }

        await this.productEntity.delete_data(productid, state.user.username);
    }

    public async l1Review(productid: number, userName: string) {
        return this.productEntity.l1Review(productid, userName);
    }

    public async unl1Review(productid: number) {
        return this.productEntity.unl1Review(productid);
    }

    public async l2Review(productid: number, userName: string) {
        return this.productEntity.l2Review(productid, userName)
    }

    public async unl2Review(productid: number) {
        return this.productEntity.unl2Review(productid)
    }

}