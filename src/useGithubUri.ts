import { useParams } from 'react-router-dom';

export function useGitHubBaseUri() {
  const { gitHubHostname } = useParams();
  return `https://${ gitHubHostname === 'api.github.com' ? 'github.com' : gitHubHostname}`
};

