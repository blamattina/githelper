export enum TimeSpan {
  LastMonth = 'LAST_MONTH',
  ThisQuarter = 'THIS_QUARTER',
  LastQuarter = 'LAST_QUARTER',
  LastThreeMonths = 'LAST_THREE_MONTHS',
  LastSixMonths = 'LAST_SIX_MONTHS',
  LastTwelveMonths = 'LAST_TWELVE_MONHTS',
}

export function isTimeSpan(maybeTimeSpan: any): maybeTimeSpan is TimeSpan {
  return Object.values(TimeSpan).includes(maybeTimeSpan);
}

export type DateRange = {
  startDate: Date;
  endDate: Date;
};
