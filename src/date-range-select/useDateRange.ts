import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import subDays from 'date-fns/subDays';
import endOfWeek from 'date-fns/endOfWeek';
import format from 'date-fns/format';

export function useDateRange() {
  const [search, setSearchParams] = useSearchParams();

  const [startDateOffset, setInternalStartDateOffset] = useState<string>(
    () => search.get('startDateOffset') || '91'
  );

  const [endDate, setInternalEndDate] = useState<Date>(() => {
    const endSearchParam = search.get('end');
    if (endSearchParam) {
      return new Date(endSearchParam);
    }
    return endOfWeek(new Date());
  });

  const setStartDateOffset = useCallback(
    (newStartDateOffset: string) => {
      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('startDateOffset', newStartDateOffset);
      setSearchParams(updatedSearchParams.toString());
      setInternalStartDateOffset(newStartDateOffset);
    },
    [setInternalStartDateOffset, setSearchParams, search]
  );

  const setEndDate = useCallback(
    (date: Date) => {
      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('end', format(date, 'MM-dd-yyyy'));
      setSearchParams(updatedSearchParams.toString());
      setInternalEndDate(date);
    },
    [setInternalEndDate, search, setSearchParams]
  );

  const startDate = useMemo(
    () => subDays(endDate, +startDateOffset),
    [endDate, startDateOffset]
  );

  return {
    startDate,
    endDate,
    startDateOffset,
    setStartDateOffset,
    setEndDate,
  };
}
