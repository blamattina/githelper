import { PullRequest } from '../generated/types';

// Scan a pull request's timeline and return true if you find a force push event
export default function hasForcePush(pullRequest: PullRequest): boolean {
  return pullRequest.timelineItems.edges.some(({ node }) => {
    return 'beforeCommit' in node || 'afterCommit' in node;
  });
}
