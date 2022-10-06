import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isSameWeek from 'date-fns/isSameWeek';

export type DateRange = '30' | '90' | '180' | '365';

type Props = {
  endDate: Date;
  range: DateRange;
  onEndDateChange: (newDate: Date) => void;
  onRangeChange: (newRange: DateRange) => void;
};

interface CustomPickerDayProps extends PickersDayProps<Date> {
  dayIsBetween: boolean;
  isFirstDay: boolean;
  isLastDay: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
})) as React.ComponentType<CustomPickerDayProps>;

export default function DateRangeSelect({
  endDate,
  range,
  onRangeChange,
  onEndDateChange,
}: Props) {
  const handleDatePickerChange = useCallback(
    (date: Date | null) => {
      if (!date) return;
      onEndDateChange(endOfWeek(date));
    },
    [onEndDateChange]
  );

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent) => {
      onRangeChange(event.target.value as DateRange);
    },
    [onRangeChange]
  );

  const renderWeekPickerDay = (
    date: Date,
    selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ) => {
    if (!endDate) {
      return <PickersDay {...pickersDayProps} />;
    }

    const dayIsBetween = isSameWeek(date, endDate);
    const isFirstDay = isSameDay(date, startOfWeek(endDate));
    const isLastDay = isSameDay(date, endOfWeek(endDate));

    return (
      <CustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
      />
    );
  };

  return (
    <>
      <FormControl>
        <InputLabel>Range</InputLabel>
        <Select
          value={String(range)}
          label="Range"
          onChange={handleSelectChange}
        >
          <MenuItem value={28}>4 Weeks</MenuItem>
          <MenuItem value={91}>3 Months</MenuItem>
          <MenuItem value={182}>6 Months</MenuItem>
        </Select>
      </FormControl>{' '}
      <DatePicker
        label="Ending on"
        value={endDate}
        onChange={handleDatePickerChange}
        renderDay={renderWeekPickerDay}
        renderInput={(params) => <TextField {...params} />}
        inputFormat="'Week of' MMM d"
      />
    </>
  );
}
