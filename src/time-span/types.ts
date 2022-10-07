export enum TimeSpan {
  LastMonth = 'LAST_MONTH',
  ThisQuarter = 'THIS_QUARTER',
  LastQuarter = 'LAST_QUARTER',
  LastHalf = 'LAST_HALF',
  LastYear = 'LAST_YEAR',
}

export function isTimeSpan(maybeTimeSpan: any): maybeTimeSpan is TimeSpan {
  return Object.values(TimeSpan).includes(maybeTimeSpan);
}

export type DateRange = {
  startDate: Date;
  endDate: Date;
};
