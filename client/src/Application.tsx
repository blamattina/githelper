import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import GitHubTokenForm from './auth/GitHubTokenForm';
import GitUserActivityPage from './GitUserActivityPage';
import GitHubApolloProvider from './auth/GitHubApolloProvider';
import GitHubServerNav from './auth/GitHubServerNav';
import GitHubTokensProvider from './auth/GitHubTokensProvider';

const Application: React.FC = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: 'rgb(240, 240, 240)', minHeight: '100vh' }}>
      <CssBaseline />
      <Container>
        <GitHubTokensProvider>
          <Routes>
            <Route path="/" element={<GitHubServerNav />}>
              <Route path="new" element={<GitHubTokenForm />} />
              <Route
                path=":gitHubHostname"
                element={
                  <GitHubApolloProvider>
                    <GitUserActivityPage />
                  </GitHubApolloProvider>
                }
              />
            </Route>
          </Routes>
        </GitHubTokensProvider>
      </Container>
    </Box>
  );
};

export default Application;
