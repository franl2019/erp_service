import * as moment from "moment";

export function getStartDateForMonth(year: number, month: number): string {

  return moment(new Date(year,month-1,1)).format("YYYY-MM-DD");
}

export function getEndDateForMonth(year: number, month: number) {
  return moment(new Date(year, month, 0)).format("YYYY-MM-DD");
}