import React, { useState, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import UserSearch from './UserSearch';
import Contributions from './Contributions';

type AuthorOption = {
  label: string;
  login: string;
};

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
  console.log(author);

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 2,
            marginBottom: 1,
          }}
        >
          <Box sx={{ display: 'flex' }}>
            <UserSearch
              label="Search by User"
              onChange={setAuthor}
              sx={{ marginRight: 1 }}
            />
          </Box>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={handleChangeStartDate}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/dd/yyyy"
            value={endDate}
            onChange={handleChangeEndDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          {author && <Contributions
            author={author.login}
            startDate={startDate}
            endDate={endDate}
          />}
        </Box>
      </Container>
    </>
  );
}

export default App;
