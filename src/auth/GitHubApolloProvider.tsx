import React, { useContext, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { useParams, Navigate, createSearchParams } from 'react-router-dom';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import { Box, Grid, Typography } from '@mui/material';

function makeUri(hostname: string): string {
  if (hostname === 'api.github.com') return 'https://api.github.com/graphql';
  return `https://${hostname}/api/graphql`;
}

const GitHubApolloProvider: React.FC = ({ children }) => {
  const [linkErrorMessage, setLinkErrorMessage] = useState<string | null>(null);
  const { getGitHubToken } = useContext(GitHubTokensContext);
  const { gitHubHostname } = useParams();

  const gitHubToken = useMemo(() => {
    setLinkErrorMessage(null);
    if (!gitHubHostname) return null;
    return getGitHubToken(gitHubHostname);
  }, [gitHubHostname, getGitHubToken]);

  const client = useMemo(() => {
    if (!gitHubToken) return null;

    const httpLink = new HttpLink({
      uri: makeUri(gitHubToken.hostname),
      headers: {
        authorization: `Bearer ${gitHubToken.token}`,
      },
    });

    const errorLink = onError(({ networkError }) => {
      if (networkError) {
        setLinkErrorMessage(`Network Error: ${networkError.message}`);
      }
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: errorLink.concat(httpLink),
    });
  }, [gitHubToken]);

  if (!client) {
    const searchParams = gitHubHostname
      ? `?${createSearchParams({ gitHubHostname })}`
      : '';
    return <Navigate to={`/new${searchParams}`} replace />;
  }

  if (linkErrorMessage) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container>
          <Grid xs={4}></Grid>
          <Grid xs={4} item style={{ textAlign: 'center' }}>
            <ErrorTwoToneIcon sx={{ fontSize: 250 }} color="error" />
          </Grid>
          <Grid xs={4}></Grid>
          <Grid xs={3}></Grid>
          <Grid xs={6} style={{ textAlign: 'center' }} item>
            <Typography variant="h5">
              {linkErrorMessage}
              <br />
              <br />
              {gitHubHostname !== 'api.github.com' &&
                'If your company requires VPN access to GitHub Enterprise, check to see if you are on the network.'}
            </Typography>
          </Grid>
          <Grid xs={3}></Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <ApolloProvider client={client}>
      <Outlet />
    </ApolloProvider>
  );
};

export default GitHubApolloProvider;
