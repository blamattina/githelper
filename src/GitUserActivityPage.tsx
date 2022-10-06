import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import GitUserChooser from './GitUserChooser';
import Contributions from './Contributions';
import DateRangeSelect from './date-range-select/DateRangeSelect';
import { useDateRange } from './date-range-select/useDateRange';

export type AuthorOption = {
  label: string;
  login: string;
  name: string;
} | null;

function GitUserActivityPage() {
  const params = useParams();
  const navigate = useNavigate();

  const {
    startDate,
    endDate,
    startDateOffset,
    setStartDateOffset,
    setEndDate,
  } = useDateRange();

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

  //Handle corner case in state when page transitions
  if (author && params.user === undefined) {
    setAuthor(null);
  } else if (params.user !== author?.name) {
    setAuthor({
      label: params.user || '',
      login: params.user || '',
      name: params.user || '',
    });
  }

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
            startDateOffset={startDateOffset}
            onStartDateOffsetChange={setStartDateOffset}
            onEndDateChange={setEndDate}
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
        />
      )}
    </Box>
  );
}

export default GitUserActivityPage;
