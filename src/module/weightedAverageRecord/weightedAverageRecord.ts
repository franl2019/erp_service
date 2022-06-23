export interface IWeightedAverageRecord {
    weightedAverageRecordId: number;
    inDate: Date;
    level1Review: number;
    level1Name: string;
    level1Date: Date;
    level2Review: number;
    level2Name: string;
    level2Date: Date;
    initReview: number;
    initName: string;
    initDate: Date;
    version: number;
    version_latest: number;
}