import {Injectable} from "@nestjs/common";
import {ProductEntity} from "./product.entity";
import {SelectProductDto} from "./dto/selectProduct.dto";
import {UpdateProductDto} from "./dto/updateProduct.dto";
import {State} from "../../interface/IState";
import {AddProductDto} from "./dto/addProduct.dto";
import {MysqldbAls} from "../mysqldb/mysqldbAls";
import {ProductAreaService} from "../productArea/productArea.service";
import {ProductAutoCodeService} from "../productAutoCode/productAutoCode.service";


@Injectable()
export class ProductService {

    constructor(
        private readonly mysqldbAls: MysqldbAls,
        private readonly productAreaService: ProductAreaService,
        private readonly productAutoCodeService: ProductAutoCodeService,
        private readonly productEntity: ProductEntity
    ) {
    }

    public async findOne(productId: number) {
        return await this.productEntity.findOne(productId);
    }

    public async find(product: SelectProductDto, state: State) {
        product.warehouseids = state.user.warehouseids;
        return await this.productEntity.find(product);
    }

    public async create(product: AddProductDto, state: State) {
        product.creater = state.user.username;
        product.createdAt = new Date();

        if (state.user.warehouseids.indexOf(product.warehouseid) === -1) {
            await Promise.reject(new Error("缺少该仓库权限,保存失败"));
        }

        return await this.mysqldbAls.sqlTransaction(async () => {
            const productArea = await this.productAreaService.findOne(product.productareaid);

            if (product.productcode.length === 0) {
                product.productcode = await this.productAutoCodeService.getProductAutoCode(productArea.parentCode)
            }

            return await this.productEntity.create(product);
        })
    }

    public async update(product: UpdateProductDto, state: State) {

        product.updater = state.user.username;
        product.updatedAt = new Date();

        return await this.mysqldbAls.sqlTransaction(async () => {
            const product_DB = await this.productEntity.findOne(product.productid);
            //验证操作区域权限，没有该客户的操作区域不能修改，更新的操作区域没有权限也不能更新
            if (state.user.warehouseids.indexOf(product_DB.warehouseid) === -1 || state.user.warehouseids.indexOf(product.warehouseid) === -1) {
                await Promise.reject(new Error("缺少该仓库权限,更新失败"));
            }

            await this.productEntity.update(product);
        });
    }

    public async delete_data(productid: number, state: State) {
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