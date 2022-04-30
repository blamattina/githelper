import React, { useState, useMemo, useCallback } from 'react';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import GitApiHostForm from './GitApiHostForm';
import { GitApiHost } from './types';

const KEY = 'GIT_API_HOST';

function getGitApiHost(): GitApiHost | null {
  const maybeHost = localStorage.getItem(KEY)
  
  if (!maybeHost) return null;

  try {
    return JSON.parse(maybeHost) as GitApiHost;
  } catch (e) {
    return null;
  }
}

function saveGitApiHost(gitApiHost: GitApiHost) {
  localStorage.setItem(KEY, JSON.stringify(gitApiHost));
}

const WrappedApolloProvider: React.FC = ({ children }) => {
  const [gitApiHost, setGitApiHost] = useState(getGitApiHost());

  const handleSave = useCallback((gitApiHost: GitApiHost) => {
    setGitApiHost(gitApiHost);
    saveGitApiHost(gitApiHost);
  }, []);

  const client = useMemo(() => {
    if (!gitApiHost) return null;
    return new ApolloClient({
      cache: new InMemoryCache(),
      uri: gitApiHost.uri,
      headers: {
        authorization: `Bearer ${gitApiHost.token}`,
      }, 
    });
  }, [gitApiHost]);


  if (!client) {
    return <GitApiHostForm onSave={handleSave} />;
  }

  return (
    <>
      <ApolloProvider client={client}>
        {children}
      </ApolloProvider>
    </>
  );
}

export default WrappedApolloProvider;
