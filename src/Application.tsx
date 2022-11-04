import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import GitHubTokenForm from './auth/GitHubTokenForm';
import GitHubUpdateTokens from './auth/GitHubUpdateTokens';
import GitOrgActivityPage from './GitOrgActivityPage';
import GitUserActivityPage from './GitUserActivityPage';
import GitHubApolloProvider from './auth/GitHubApolloProvider';
import GitHubServerNav from './auth/GitHubServerNav';
import GitHubTokensProvider, {
  GitHubTokensContext,
} from './auth/GitHubTokensProvider';
import GitRepoActivityPage from './GitRepoActivityPage';
import ReactGA from 'react-ga4';

const REACT_TRACKING_ID = 'G-HQG37QXW8S';

const GitHubServerIndexRedirect: React.FC = () => {
  const { getGitHubTokens } = useContext(GitHubTokensContext);
  const gitHubTokens = getGitHubTokens();
  const nextRoute = gitHubTokens.length ? `${gitHubTokens[0].hostname}` : 'new';
  return <Navigate to={nextRoute} replace />;
};

const Application: React.FC = ({ children }) => {
  ReactGA.initialize(REACT_TRACKING_ID, {
    //disables GA locally - TODO should be passed as environment variable, this is kind of a hack.
    testMode: window.location.href.includes('localhost'),
  });

  return (
    <Box sx={{ backgroundColor: 'rgb(240, 240, 240)', minHeight: '100vh' }}>
      <CssBaseline />
      <GitHubTokensProvider>
        <Routes>
          <Route path="/" element={<GitHubServerNav />}>
            <Route path="new" element={<GitHubTokenForm />} />
            <Route path=":gitHubHostname" element={<GitHubApolloProvider />}>
              <Route path="users" element={<GitUserActivityPage />} />
              <Route path="users/:user" element={<GitUserActivityPage />} />
              <Route index element={<Navigate to="users" replace />} />

              <Route path="org" element={<GitOrgActivityPage />} />
              <Route path="org/:org" element={<GitOrgActivityPage />} />
              <Route
                path="org/:org/team/:team"
                element={<GitOrgActivityPage />}
              />

              <Route path="repo" element={<GitRepoActivityPage />} />
              <Route
                path="repo/:login/:repo"
                element={<GitRepoActivityPage />}
              />
            </Route>
            <Route path="manage" element={<GitHubUpdateTokens />} />
            <Route index element={<GitHubServerIndexRedirect />} />
          </Route>
        </Routes>
      </GitHubTokensProvider>
    </Box>
  );
};

export default Application;
