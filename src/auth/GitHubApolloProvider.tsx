import React, { useContext, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { useParams, Navigate, createSearchParams } from 'react-router-dom';

function makeUri(hostname: string): string {
  if (hostname === 'api.github.com') return 'https://api.github.com';
  return `https://${hostname}/api`;
}

function getRequiredScopes(hostname: string): string[] {
  const requiredScopes = ['read:discussion', 'read:org', 'read:user', 'repo'];

  if (hostname !== 'api.github.com') {
    requiredScopes.push('read:enterprise');
  }

  return requiredScopes;
}

function findMissingScopes(hostname: string, scopes: string[]): string[] {
  const requiredScopes = getRequiredScopes(hostname);
  const missingScopes = requiredScopes.reduce((acc, scope: string) => {
    if (!scopes.includes(scope)) acc.push(scope);
    return acc;
  }, [] as string[]);
  return missingScopes;
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
      uri: `${makeUri(gitHubToken.hostname)}/graphql`,
      headers: {
        authorization: `Bearer ${gitHubToken.token}`,
      },
    });

    const errorLink = onError(({ networkError }) => {
      if (networkError) {
        setLinkErrorMessage(`Network Error: ${networkError.message}`);
      }
    });

    const scopeValidationLink = new ApolloLink((operation, forward) => {
      return forward(operation).map((response) => {
        const context = operation.getContext();
        const {
          response: { headers },
        } = context;
        console.log(response);
        const scopes = headers.get('x-oauth-scopes').split(', ');

        const missingScopes = findMissingScopes(gitHubToken.hostname, scopes);

        if (missingScopes.length) {
          setLinkErrorMessage(
            `Personal Access Token for ${gitHubHostname} is missing required scopes: ${missingScopes.join()}`
          );
        }

        return response;
      });
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      link: scopeValidationLink.concat(errorLink).concat(httpLink),
    });
  }, [gitHubToken]);

  if (!client) {
    const searchParams = gitHubHostname
      ? `?${createSearchParams({ gitHubHostname })}`
      : '';
    return <Navigate to={`/new${searchParams}`} replace />;
  }

  if (linkErrorMessage) {
    return <div>{linkErrorMessage}</div>;
  }

  return (
    <ApolloProvider client={client}>
      <Outlet />
    </ApolloProvider>
  );
};

export default GitHubApolloProvider;
