import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export type DateRange = '30' | '90' | '180' | '365';

type Props = {
  endDate: Date;
  range: DateRange;
  onEndDateChange: (newDate: Date) => void;
  onRangeChange: (newRange: DateRange) => void;
};

export default function DateRangeSelect({
  endDate,
  range,
  onRangeChange,
  onEndDateChange,
}: Props) {
  const handleDatePickerChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      onEndDateChange(date);
    },
    [onEndDateChange]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent) => {
      onRangeChange(event.target.value as DateRange);
    },
    [onRangeChange]
  );

  return (
    <>
      <FormControl>
        <InputLabel>Range</InputLabel>
        <Select
          value={String(range)}
          label="Range"
          onChange={handleSelectChange}
        >
          <MenuItem value={30}>30 Days</MenuItem>
          <MenuItem value={90}>90 Days</MenuItem>
          <MenuItem value={180}>180 Days</MenuItem>
          <MenuItem value={365}>365 Days</MenuItem>
        </Select>
      </FormControl>{' '}
      <DesktopDatePicker
        label="Ending on"
        inputFormat="MM/dd/yyyy"
        value={endDate}
        onChange={handleDatePickerChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </>
  );
}
