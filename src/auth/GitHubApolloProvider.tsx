import React, { useContext, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { useParams, Navigate, createSearchParams } from 'react-router-dom';

function makeUri(hostname: string): string {
  if (hostname === 'api.github.com') return 'https://api.github.com/graphql';
  return `https://${hostname}/api/graphql`;
}

const GitHubApolloProvider: React.FC = ({ children }) => {
  const { getGitHubToken } = useContext(GitHubTokensContext);
  const { gitHubHostname } = useParams<"gitHubHostname">();

  const gitHubToken = useMemo(() => {
    if (!gitHubHostname) return null;
    return getGitHubToken(gitHubHostname);
  }, [gitHubHostname, getGitHubToken]);

  const client = useMemo(() => {
    if (!gitHubToken) return null;
    return new ApolloClient({
      cache: new InMemoryCache(),
      uri: makeUri(gitHubToken.hostname),
      headers: {
        authorization: `Bearer ${gitHubToken.token}`,
      },
    });
  }, [gitHubToken]);

  if (!client) {
    const searchParams = gitHubHostname ? `?${createSearchParams({ gitHubHostname })}` : '';
    return <Navigate to={`/new${searchParams}`} replace />;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GitHubApolloProvider;
