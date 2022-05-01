const KEY = 'GITHUB_TOKENS';

export type GitHubToken = {
  hostname: string;
  token: string;
}


export function getGitHubTokens(): GitHubToken[] {
  const maybeHost = localStorage.getItem(KEY);

  if (!maybeHost) return [];

  try {
    return JSON.parse(maybeHost) as GitHubToken[];
  } catch (e) {
    return [];
  }
}

export function addGitHubToken(gitHubToken: GitHubToken) {
  const tokens = getGitHubTokens();
  tokens.push(gitHubToken);
  localStorage.setItem(KEY, JSON.stringify(tokens));
}

export function getGitHubToken(hostname: string): GitHubToken | undefined {
  const tokens = getGitHubTokens();
  return tokens.find(token => token.hostname === hostname);
}
