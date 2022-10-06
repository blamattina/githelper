import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import GitUserChooser from './GitUserChooser';
import Contributions from './Contributions';
import format from 'date-fns/format';
import subDays from 'date-fns/subDays';
import DateRangeSelect, { DateRange } from './DateRangeSelect';

export type AuthorOption = {
  label: string;
  login: string;
  name: string;
} | null;

function GitUserActivityPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearchParams] = useSearchParams();
  const [range, setRange] = useState<DateRange>(
    () => (search.get('range') || '90') as DateRange
  );

  const [author, setAuthor] = useState<AuthorOption>((): AuthorOption => {
    if (params.user) {
      //TODO - This works but won't show name (just username) - how do I return value of these correctly?
      return {
        label: params.user || '',
        login: params.user || '',
        name: params.user || '',
      };
    }

    return null;
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    const endSearchParam = search.get('end');
    if (endSearchParam) {
      return new Date(endSearchParam);
    }
    return new Date();
  });

  //Handle corner case in state when page transitions
  if (author && params.user === undefined) {
    setAuthor(null);
    setEndDate(new Date());
  } else if (params.user !== author?.name) {
    setAuthor({
      label: params.user || '',
      login: params.user || '',
      name: params.user || '',
    });
    setEndDate(new Date());
  }

  const handleChangeRange = useCallback(
    (newRange: DateRange) => {
      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('range', String(newRange));
      setSearchParams(updatedSearchParams.toString());
      setRange(newRange);
    },
    [setRange, setSearchParams, search]
  );

  const handleChangeEndDate = useCallback(
    (date: Date) => {
      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('end', format(date, 'MM-dd-yyyy'));
      setSearchParams(updatedSearchParams.toString());
      setEndDate(date);
    },
    [setEndDate, search, setSearchParams]
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <GitUserChooser
          label="Search by User"
          initialValue={author}
          onChange={(author: AuthorOption) => {
            if (author && author.login) {
              navigate(`/${params.gitHubHostname}/users/${author.login}`);
            } else {
              navigate(`/${params.gitHubHostname}/users`);
            }
            setAuthor(author);
          }}
        />
        <Box>
          <DateRangeSelect
            endDate={endDate}
            range={range}
            onRangeChange={handleChangeRange}
            onEndDateChange={handleChangeEndDate}
          />
        </Box>
      </Box>
      <br />
      {author && (
        <Contributions
          login={author.login}
          name={author.name}
          startDate={subDays(endDate, +range)}
          endDate={endDate}
        />
      )}
    </Box>
  );
}

export default GitUserActivityPage;
