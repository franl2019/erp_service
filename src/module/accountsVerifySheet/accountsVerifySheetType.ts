export enum AccountsVerifySheetType {
    /*
    * [1]预收冲应收
    * [2]预付冲应付
    * [3]应收冲应付
    * [4]应收转应收
    * [5]应付转应付
    * */
    advancePayment_accountsReceivable_1 = 1,
    prepayments_accountsPayable_2 = 2,
    accountsReceivable_accountsPayable_3 = 3,
    accountsReceivable_accountsReceivable_4 = 4,
    accountsPayable_accountsPayable_5 = 5,
}
