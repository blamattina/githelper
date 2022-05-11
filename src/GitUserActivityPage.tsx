import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import GitUserChooser from './GitUserChooser';
import Contributions from './Contributions';
import format from 'date-fns/format';

const LARGE_PR_LIMIT = 5000;

export type AuthorOption = {
  label: string;
  login: string;
  name: string;
} | null;

function subtractDaysFromDate(d: Date, daystoSubtract: number) {
  d.setDate(d.getDate() - daystoSubtract);
  return d;
}

function GitUserActivityPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearchParams] = useSearchParams();
  const [pullRequestSizeLimit, setPullRequestSizeLimit] =
    useState<number>(LARGE_PR_LIMIT);

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

  const [startDate, setStartDate] = useState<Date>(() => {
    const startSearchParam = search.get('start');
    if (startSearchParam) {
      return new Date(startSearchParam);
    }
    return subtractDaysFromDate(new Date(), 90);
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
    setStartDate(subtractDaysFromDate(new Date(), 90));
    setEndDate(new Date());
  } else if (params.user !== author?.name) {
    setAuthor({
      label: params.user || '',
      login: params.user || '',
      name: params.user || '',
    });
    setStartDate(subtractDaysFromDate(new Date(), 90));
    setEndDate(new Date());
  }

  const handleChangeStartDate = useCallback(
    (date: Date | null) => {
      if (!date) return;
      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('start', format(date, 'MM-dd-yyyy'));
      setSearchParams(updatedSearchParams.toString());
      setStartDate(date);
    },
    [setStartDate, search, setSearchParams]
  );

  const handleChangeEndDate = useCallback(
    (date: Date | null) => {
      if (!date) return;

      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('end', format(date, 'MM-dd-yyyy'));
      setSearchParams(updatedSearchParams.toString());

      setEndDate(date);
    },
    [setEndDate, search, setSearchParams]
  );

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPullRequestSizeLimit(event.target.checked ? LARGE_PR_LIMIT : Infinity);
    },
    []
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
        <Box sx={{ display: 'flex' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginRight: 2 }}
          >
            <Typography>
              Filter out &gt;{LARGE_PR_LIMIT} line change PRs
            </Typography>
            <Switch
              onChange={handleFilterChange}
              checked={pullRequestSizeLimit === LARGE_PR_LIMIT}
            />
          </Stack>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={handleChangeStartDate}
            renderInput={(params) => <TextField {...params} />}
          />{' '}
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/dd/yyyy"
            value={endDate}
            onChange={handleChangeEndDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </Box>
      <br />
      {author && (
        <Contributions
          login={author.login}
          name={author.name}
          startDate={startDate}
          endDate={endDate}
          pullRequestSizeLimit={pullRequestSizeLimit}
        />
      )}
    </Box>
  );
}

export default GitUserActivityPage;
