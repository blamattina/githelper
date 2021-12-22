import { Octokit } from 'octokit';

const octokit = new Octokit({
  baseUrl: process.env.REACT_APP_GITHUB_API_URL,
  auth: process.env.REACT_APP_GITHUB_PERSONAL_AUTH_TOKEN
});

export { 
  octokit
}
