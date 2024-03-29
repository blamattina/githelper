import React, { useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import format from 'date-fns/format';
import { timePeriodToDates } from './timePeriodToDates';
import { TimeSpan, isTimeSpan } from './types';

type Props = {
  timePeriod: TimeSpan;
  onTimeSpanChange: (newTimePeriod: TimeSpan) => void;
};

function formatDateRange(timePeriod: TimeSpan) {
  const { startDate, endDate } = timePeriodToDates(timePeriod) as any;

  return `(${format(startDate, 'MMM dd Y')} - ${format(endDate, 'MMM dd Y')})`;
}

export default function TimeSpanSelect({
  timePeriod,
  onTimeSpanChange,
}: Props) {
  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      const maybeTimeSpan = event.target.value;
      if (isTimeSpan(maybeTimeSpan)) {
        onTimeSpanChange(maybeTimeSpan);
      }
    },
    [onTimeSpanChange]
  );

  return (
    <>
      <FormControl>
        <InputLabel>Time Span</InputLabel>
        <Select label="Time Span" value={timePeriod} onChange={handleChange}>
          <MenuItem value={TimeSpan.LastMonth}>
            4 Weeks {formatDateRange(TimeSpan.LastMonth)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastThreeMonths}>
            3 Months {formatDateRange(TimeSpan.LastThreeMonths)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastSixMonths}>
            6 Months {formatDateRange(TimeSpan.LastSixMonths)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastTwelveMonths}>
            12 Months {formatDateRange(TimeSpan.LastTwelveMonths)}
          </MenuItem>
          <MenuItem value={TimeSpan.ThisQuarter}>
            This Quarter {formatDateRange(TimeSpan.ThisQuarter)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastQuarter}>
            Last Quarter {formatDateRange(TimeSpan.LastQuarter)}
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
