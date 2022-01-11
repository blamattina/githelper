import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import PrTable from './PrTable';
import AuthorSearch from './AuthorSearch';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const VIEWER_LOGIN = gql`
  query {
    viewer {
      login
    }
  }
`;

function App() {
  const [authors, setAuthors] = useState([]);
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
          <AuthorSearch setAuthors={setAuthors} />
          <Box sx={{ alignSelf: 'center' }}>
            Authenticated as {data.viewer.login} on{' '}
            {process.env.REACT_APP_GITHUB_API_URL}
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <PrTable authors={authors} />
        </Box>
      </Container>
    </>
  );
}

export default App;
