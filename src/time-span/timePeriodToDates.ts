import subDays from 'date-fns/subDays';
import subMonths from 'date-fns/subMonths';
import subQuarters from 'date-fns/subQuarters';
import subYears from 'date-fns/subYears';
import endOfQuarter from 'date-fns/endOfQuarter';
import startOfQuarter from 'date-fns/startOfQuarter';
import { TimeSpan, DateRange } from './types';

export function timePeriodToDates(timePeriod: TimeSpan): DateRange {
  const today = new Date();
  switch (timePeriod) {
    case TimeSpan.LastTwelveMonths: {
      return {
        startDate: subYears(today, 1),
        endDate: today,
      };
    }

    case TimeSpan.LastSixMonths: {
      return {
        startDate: subMonths(today, 6),
        endDate: today,
      };
    }

    case TimeSpan.LastQuarter: {
      const lastQuarter = subQuarters(today, 1);
      return {
        startDate: startOfQuarter(lastQuarter),
        endDate: endOfQuarter(lastQuarter),
      };
    }
    case TimeSpan.ThisQuarter: {
      return {
        startDate: startOfQuarter(today),
        endDate: endOfQuarter(today),
      };
    }

    case TimeSpan.LastMonth: {
      return {
        startDate: subDays(today, 28),
        endDate: today,
      };
    }
  }
}
