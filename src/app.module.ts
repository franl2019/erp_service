import {MiddlewareConsumer, Module, NestModule, Scope} from '@nestjs/common';
import {UserModule} from './module/user/user.module';
import {AuthModule} from './module/auth/auth.module';
import {LoggerMiddleware} from './middleware/logger.middleware';
import {UserOperateAreaMxModule} from './module/userOperateAreaMx/userOperateAreaMx.module';
import {OperateareaModule} from './module/operateArea/operatearea.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {UserInfoInterceptor} from './interceptors/userInfo.interceptor';
import {BuyAreaModule} from './module/buyArea/buyArea.module';
import {BuyModule} from './module/buy/buy.module';
import {CurrencyModule} from './module/currency/currency.module';
import {ClientAreaModule} from './module/clientArea/clientArea.module';
import {ClientModule} from './module/client/client.module';
import {ProductModule} from './module/product/product.module';
import {ProductAreaModule} from './module/productArea/productArea.module';
import {WarehouseModule} from './module/warehouse/warehouse.module';
import {UserWarehouseMxModule} from './module/userWarehouseMx/userWarehouseMx.module';
import {InboundModule} from './module/inbound/inbound.module';
import {AutoCodeModule} from './module/autoCode/autoCode.module';
import {AutoCodeMxModule} from './module/autoCodeMx/autoCodeMx.module';
import {InboundMxModule} from './module/inbound_mx/inbound_mx.module';
import {InventoryModule} from './module/inventory/inventory.module';
import {MysqldbModule} from './module/mysqldb/mysqldb.module';
import {TableColumnStateModule} from './module/tableColumnState/tableColumnState.module';
import {OutboundModule} from './module/outbound/outbound.module';
import {Outbound_mxModule} from './module/outbound_mx/outbound_mx.module';
import {AccountModule} from './module/account/account.module';
import {UserAccountMxModule} from './module/userAccountMx/userAccountMx.module';
import {ProductionInboundModule} from './module/productionInbound/productionInbound.module';
import {SaleOutboundModule} from './module/saleOutbound/saleOutbound.module';
import {BuyInboundModule} from './module/buyInbound/buyInbound.module';
import {AccountRecordModule} from './module/accountsRecord/accountRecord.module';
import {AccountExpenditureModule} from './module/accountExpenditure/accountExpenditure.module';
import {AccountInComeModule} from './module/accountInCome/accountInCome.module';
import {AccountsReceivableModule} from "./module/accountsReceivable/accountsReceivable.module";
import {AccountsReceivableMxModule} from "./module/accountsReceivableMx/accountsReceivableMx.module";
import {AccountsPayableModule} from "./module/accountsPayable/accountsPayable.module";
import {AccountsPayableMxModule} from "./module/accountsPayableMx/accountsPayableMx.module";
import {AccountInComeAmountMxModule} from "./module/accountInComeAmountMx/accountInComeAmountMx.module";
import {AccountInComeSheetMxModule} from "./module/accountInComeSheetMx/accountInComeSheetMx.module";
import {AccountsPayableSubjectMxModule} from "./module/accountsPayableMxSubject/accountsPayableSubjectMx.module";
import {
    AccountsReceivableSubjectMxModule
} from "./module/accountsReceivableSubjectMx/accountsReceivableSubjectMx.module";
import {AccountExpenditureSheetMxModule} from "./module/accountExpenditureSheetMx/accountExpenditureSheetMx.module";
import {AccountExpenditureAmountMxModule} from "./module/accountExpenditureAmountMx/accountExpenditureAmountMx.module";

@Module({
    imports: [
        MysqldbModule,
        UserModule,
        AuthModule,
        UserOperateAreaMxModule,
        UserWarehouseMxModule,
        OperateareaModule,
        BuyAreaModule,
        BuyModule,
        ClientAreaModule,
        ClientModule,
        CurrencyModule,
        ProductModule,
        ProductAreaModule,
        WarehouseModule,
        //进仓单模块
        InboundModule,
        InboundMxModule,
        AutoCodeModule,
        AutoCodeMxModule,
        //生产进仓
        ProductionInboundModule,
        //采购进仓
        BuyInboundModule,
        InventoryModule,
        TableColumnStateModule,
        AccountModule,
        UserAccountMxModule,
        //出仓单模块
        OutboundModule,
        Outbound_mxModule,
        //销售出仓
        SaleOutboundModule,
        //出纳账户明细
        AccountRecordModule,
        //出纳账户支出单
        AccountExpenditureModule,
        //收入单
        AccountInComeModule,
        //收入单收款明细
        AccountInComeAmountMxModule,
        //收入单核销明细
        AccountInComeSheetMxModule,
        //应收账款
        AccountsReceivableModule,
        //应收账款明细
        AccountsReceivableMxModule,
        //应收账款科目明细
        AccountsReceivableSubjectMxModule,
        //应付账款
        AccountsPayableModule,
        //应付账款明细
        AccountsPayableMxModule,
        //应付账款科目明细
        AccountsPayableSubjectMxModule,
        //支出单
        AccountExpenditureModule,
        //支出单收款明细
        AccountExpenditureAmountMxModule,
        //支出单核销明细
        AccountExpenditureSheetMxModule
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            scope: Scope.REQUEST,
            useClass: UserInfoInterceptor,
        },
    ],
    controllers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*'); //* = 应用LoggerMiddleware中间件
    }
}
