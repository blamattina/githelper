import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import GitUserChooser from './GitUserChooser';
import Contributions from './Contributions';

export type AuthorOption = {
  label: string;
  login: string;
  name: string;
} | null;

function GitUserActivityPage() {
  const params = useParams();
  const navigate = useNavigate();

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
  }

  const [startDate, setStartDate] = useState<Date>(() => {
    let d = new Date();
    d.setDate(d.getDate() - 90);
    return d;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleChangeStartDate = useCallback(
    (date: Date | null) => {
      if (!date) return;
      setStartDate(date);
    },
    [setStartDate]
  );

  const handleChangeEndDate = useCallback(
    (date: Date | null) => {
      if (!date) return;
      setEndDate(date);
    },
    [setEndDate]
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
        />
      )}
    </Box>
  );
}

export default GitUserActivityPage;
