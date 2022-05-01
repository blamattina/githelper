import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import GitHubTokenForm from './auth/GitHubTokenForm';
import GitUserActivityPage from './GitUserActivityPage';
import GitHubApolloProvider from './auth/GitHubApolloProvider';

const Application: React.FC = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: 'rgb(240, 240, 240)', minHeight: '100vh' }}>
      <CssBaseline />
      <Container>
        <Routes>
          <Route path="/new" element={<GitHubTokenForm />} />
          <Route
            path="/:gitHubHostname"
            element={
              <GitHubApolloProvider>
                <GitUserActivityPage />
              </GitHubApolloProvider>
            }
          />
        </Routes>
      </Container>
    </Box>
  );
};

export default Application;
