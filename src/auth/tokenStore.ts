const KEY = 'GITHUB_TOKENS';

export type GitHubToken = {
  hostname: string;
  token: string;
};

export function readGitHubTokens(): GitHubToken[] {
  const maybeHost = localStorage.getItem(KEY);

  if (!maybeHost) return [];

  try {
    return JSON.parse(maybeHost) as GitHubToken[];
  } catch (e) {
    return [];
  }
}

export function writeGitHubToken(gitHubToken: GitHubToken) {
  const tokens = readGitHubTokens();
  tokens.push(gitHubToken);
  localStorage.setItem(KEY, JSON.stringify(tokens));
}

export function deleteGitHubToken(gitHubToken: GitHubToken) {
  let tokens = readGitHubTokens();
  tokens = tokens.filter((token) => token.hostname !== gitHubToken.hostname);
  localStorage.setItem(KEY, JSON.stringify(tokens));
}
