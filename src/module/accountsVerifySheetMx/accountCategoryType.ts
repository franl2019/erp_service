//账款类别
export const enum AccountCategoryType {
    /*
    *[1]应收账款
    *[2]预收账款
    *[3]其他应收
    *[4]应付账款
    *[5]预付账款
    *[6]其他应付
    * */
    accountsReceivable = 1,
    advancePayment = 2,
    otherReceivables = 3,
    accountsPayable = 4,
    prepayments = 5,
    otherPayable = 6
}