import React, { useCallback } from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import format from 'date-fns/format';
import { timePeriodToDates } from "./timePeriodToDates";
import { TimeSpan, isTimeSpan } from "./types";

type Props = {
  timePeriod: TimeSpan;
  onTimeSpanChange: (newTimePeriod: TimeSpan) => void;
};


function formatDateRange(timePeriod: TimeSpan) {
  const { startDate, endDate } = timePeriodToDates(timePeriod) as any

  return `(${format(startDate, "MMM dd Y")} - ${format(endDate, "MMM dd Y")})`;
}

export default function TimeSpanSelect({
  timePeriod,
  onTimeSpanChange: onTimeSpanChange
}: Props) {

  const handleChange = useCallback((event: SelectChangeEvent) => {
    const maybeTimeSpan = event.target.value;
    if (isTimeSpan(maybeTimeSpan)) {
      onTimeSpanChange(maybeTimeSpan);
    }
  }, [onTimeSpanChange]);

  return (
    <>
      <FormControl>
        <InputLabel>Time Span</InputLabel>
        <Select
          label="Time Span"
          value={timePeriod}
          onChange={handleChange}
        >
          <MenuItem value={TimeSpan.LastMonth}>
          Last Four Weeks {formatDateRange(TimeSpan.LastMonth)}
          </MenuItem>
          <MenuItem value={TimeSpan.ThisQuarter}>
          This Quarter {formatDateRange(TimeSpan.ThisQuarter)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastQuarter}>
          Last Quarter {formatDateRange(TimeSpan.LastQuarter)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastHalf}>
          Last Half {formatDateRange(TimeSpan.LastHalf)}
          </MenuItem>
          <MenuItem value={TimeSpan.LastYear}>
          Last year {formatDateRange(TimeSpan.LastYear)}
          </MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
