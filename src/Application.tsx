import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import GitHubTokenForm from './auth/GitHubTokenForm';
import GitUserActivityPage from './GitUserActivityPage';
import GitHubApolloProvider from './auth/GitHubApolloProvider';
import GitHubServerNav from './auth/GitHubServerNav';
import GitHubTokensProvider, { GitHubTokensContext } from './auth/GitHubTokensProvider';


const GitHubServerIndexRedirect: React.FC = () => {
  const { getGitHubTokens } = useContext(GitHubTokensContext);
  const gitHubTokens = getGitHubTokens();
  const nextRoute = gitHubTokens.length ? `${gitHubTokens[0].hostname}` : 'new';
  return <Navigate to={nextRoute} replace />
};

const Application: React.FC = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: 'rgb(240, 240, 240)', minHeight: '100vh' }}>
      <CssBaseline />
      <Container maxWidth="xl">
        <GitHubTokensProvider>
          <Routes>
            <Route path="/" element={<GitHubServerNav />}>
              <Route path="new" element={<GitHubTokenForm />} />
              <Route path=":gitHubHostname" element={<GitHubApolloProvider/ >}>
                <Route path="users" element={<GitUserActivityPage />} />
                <Route path="users/:user" element={<GitUserActivityPage />} />
                <Route index element={<Navigate to="users" replace />} />
              </Route>
              <Route index element={<GitHubServerIndexRedirect />} />
            </Route>
          </Routes>
        </GitHubTokensProvider>
      </Container>
    </Box>
  );
};

export default Application;
