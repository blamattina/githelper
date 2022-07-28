import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import GitRepoChooser from './GitRepoChooser';
import RepoContributions from './RepoContributions';
import format from 'date-fns/format';

export type RepoOption = {
  label: string;
  login: string;
  name: string;
} | null;

function subtractDaysFromDate(d: Date, daystoSubtract: number) {
  d.setDate(d.getDate() - daystoSubtract);
  return d;
}

function GitRepoActivityPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearchParams] = useSearchParams();

  const [repo, setRepo] = useState<RepoOption>((): RepoOption => {
    if (params.repo) {
      return {
        label: `${params.login}/${params.repo}` || '',
        login: params.login || '',
        name: params.repo || '',
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
  if (repo && params.repo === undefined) {
    setRepo(null);
    setStartDate(subtractDaysFromDate(new Date(), 90));
    setEndDate(new Date());
  } else if (params.repo !== repo?.name) {
    setRepo({
      label: `${params.login}/${params.repo}` || '',
      login: params.login || '',
      name: params.repo || '',
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <GitRepoChooser
          label="Search by Repository"
          initialValue={repo}
          onChange={(repo: RepoOption) => {
            if (repo && repo.name) {
              navigate(
                `/${params.gitHubHostname}/repo/${repo.login}/${repo.name}`
              );
            } else {
              navigate(`/${params.gitHubHostname}/repo`);
            }
            setRepo(repo);
          }}
        />
        <Box>
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
      {repo && (
        <RepoContributions
          login={repo.login}
          name={repo.name}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </Box>
  );
}

export default GitRepoActivityPage;
