import React, { useContext, useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { useParams, useNavigate } from 'react-router-dom';

function makeUri(hostname: string): string {
  if (hostname === 'api.github.com') return 'https://api.github.com/graphql';
  return `https://${hostname}/api/graphql`;
}

const GitHubApolloProvider: React.FC = ({ children }) => {
  const { getGitHubToken } = useContext(GitHubTokensContext);

  const params = useParams();
  const navigate = useNavigate();

  const gitHubToken = useMemo(() => {
    if (!params.gitHubHostname) return null;
    return getGitHubToken(params.gitHubHostname);
  }, [params, getGitHubToken]);

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
    navigate(`/new`, { replace: true });
    return null;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GitHubApolloProvider;
