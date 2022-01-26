import React, { useState, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import UserSearch from './UserSearch';
import TeamSearch from './TeamSearch';
import Contributions from './Contributions';
import TeamContributions from './TeamContributions';

type AuthorOption = {
  label: string;
  login: string;
};

type TeamOption = {
  label: string;
  slug: string;
  members: string[];
};

function App() {
  const [authors, setAuthors] = useState<AuthorOption[]>([]);
  const [teams, setTeams] = useState<TeamOption[]>([]);
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
              onChange={setAuthors}
              sx={{ marginRight: 1 }}
            />
            <TeamSearch
              label="Search by Team"
              onChange={setTeams}
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
          {authors.map((author) => (
            <Contributions
              key={author.login}
              authors={[author.login]}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
          {teams.map((team) => (
            <TeamContributions
              key={team.slug}
              organization="HubSpot"
              teamSlug={team.slug}
              authors={team.members}
              startDate={startDate}
              endDate={endDate}
            />
          ))}
        </Box>
      </Container>
    </>
  );
}

export default App;
