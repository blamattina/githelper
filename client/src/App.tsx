import React, { useState, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import UserSearch from './UserSearch';
import Contributions from './Contributions';
import Grid from '@mui/material/Grid';

type AuthorOption = {
  label: string;
  login: string;
  name: string;
} | null;

function App() {
  const [author, setAuthor] = useState<AuthorOption>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
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
    <Box sx={{ backgroundColor: 'rgb(240, 240, 240)' }}>
      <CssBaseline />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          paddingTop: '20px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <UserSearch
            label="Search by User"
            onChange={setAuthor}
            sx={{ marginRight: 1 }}
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
      </Container>
    </Box>
  );
}

export default App;
