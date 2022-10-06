import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import GitRepoChooser from './GitRepoChooser';
import RepoContributions from './RepoContributions';
import DateRangeSelect from './date-range-select/DateRangeSelect';
import { useDateRange } from './date-range-select/useDateRange';

export type RepoOption = {
  label: string;
  login: string;
  name: string;
} | null;

function GitRepoActivityPage() {
  const params = useParams();
  const navigate = useNavigate();

  const {
    startDate,
    endDate,
    startDateOffset,
    setStartDateOffset,
    setEndDate,
  } = useDateRange();

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

  //Handle corner case in state when page transitions
  if (repo && params.repo === undefined) {
    setRepo(null);
  } else if (params.repo !== repo?.name) {
    setRepo({
      label: `${params.login}/${params.repo}` || '',
      login: params.login || '',
      name: params.repo || '',
    });
  }

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
          <DateRangeSelect
            endDate={endDate}
            startDateOffset={startDateOffset}
            onStartDateOffsetChange={setStartDateOffset}
            onEndDateChange={setEndDate}
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
