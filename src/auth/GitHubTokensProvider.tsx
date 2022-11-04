import React, { useState, useCallback, useMemo } from 'react';
import {
  deleteGitHubToken,
  readGitHubTokens,
  writeGitHubToken,
  GitHubToken,
} from './tokenStore';

type GitHubTokensContextType = {
  getGitHubTokens(): GitHubToken[];
  getGitHubToken(hostname: string): GitHubToken | undefined;
  addGitHubToken(gitHubToken: GitHubToken): void;
  deleteGitHubToken(gitHubToken: GitHubToken): void;
};

export const GitHubTokensContext = React.createContext<GitHubTokensContextType>(
  {
    getGitHubTokens: () => [],
    getGitHubToken: () => undefined,
    addGitHubToken: () => {},
    deleteGitHubToken: () => {},
  }
);

const GitHubTokensProvider: React.FC = ({ children }) => {
  const [gitHubTokens, setGitHubTokens] = useState(readGitHubTokens());

  const getGitHubToken = useCallback(
    (hostname) =>
      gitHubTokens.find((gitHubToken) => gitHubToken.hostname === hostname),
    [gitHubTokens]
  );

  const addGitHubToken = useCallback(
    (gitHubToken: GitHubToken) => {
      writeGitHubToken(gitHubToken);
      setGitHubTokens(readGitHubTokens());
    },
    [setGitHubTokens]
  );

  const tokenStore = useMemo(() => {
    return {
      getGitHubTokens: () => gitHubTokens,
      addGitHubToken,
      getGitHubToken,
      deleteGitHubToken,
    };
  }, [gitHubTokens, getGitHubToken, addGitHubToken]);

  return (
    <GitHubTokensContext.Provider value={tokenStore}>
      {children}
    </GitHubTokensContext.Provider>
  );
};

export default GitHubTokensProvider;
