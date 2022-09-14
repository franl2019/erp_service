export interface ISystemConfigMx {
    //账套配置单头id
    systemConfigHeadId: number;
    //账套配置项id
    systemConfigOptionId: number;
    //账套配置项选中明细id
    systemConfigOptionMxId: number;

    updater: string | null;
    updatedAt: Date | null;
}