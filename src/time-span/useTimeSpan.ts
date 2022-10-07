import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TimeSpan, isTimeSpan } from './types';
import { timePeriodToDates } from './timePeriodToDates';

export function useTimePeriod() {
  const [search, setSearchParams] = useSearchParams();

  const [timePeriod, setTimePeriod] = useState<TimeSpan>(() => {
    const period = search.get('period');
    return isTimeSpan(period) ? period : TimeSpan.LastMonth;
  });

  useEffect(() => {
    let updatedSearchParams = new URLSearchParams(search.toString());
    updatedSearchParams.set('period', timePeriod);
    setSearchParams(updatedSearchParams.toString());
  }, [timePeriod, search, setSearchParams]);

  const { startDate, endDate } = useMemo(
    () => timePeriodToDates(timePeriod),
    [timePeriod]
  );

  return {
    startDate,
    endDate,
    timePeriod,
    setTimePeriod,
  };
}
