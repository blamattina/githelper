import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import PrTable from './PrTable';
import UserSearch from './UserSearch';
import TeamSearch from './TeamSearch';

const VIEWER_LOGIN = gql`
  query {
    viewer {
      login
    }
  }
`;

function App() {
  const [authors, setAuthors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [reviewedBy, setReviewedBy] = useState([]);
  const { data, loading, error } = useQuery(VIEWER_LOGIN);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>ERROR! {error.message}</div>;

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
              label="Authored by user"
              onChange={setAuthors}
              sx={{ marginRight: 1 }}
            />
            <TeamSearch
              label="Authored by team"
              onChange={setTeams}
              sx={{ marginRight: 1 }}
            />
            <UserSearch
              label="Mentioning"
              onChange={setMentions}
              sx={{ marginRight: 1 }}
            />
            <UserSearch label="Reviewed by" onChange={setReviewedBy} />
          </Box>
          <Box sx={{ alignSelf: 'center' }}>
            Authenticated as {data.viewer.login} on{' '}
            {process.env.REACT_APP_GITHUB_API_URL}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <PrTable
            authors={Array.from(new Set(teams.concat(authors).flat()))}
            mentions={mentions}
            reviewedBy={reviewedBy}
          />
        </Box>
      </Container>
    </>
  );
}

export default App;
