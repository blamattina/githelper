import { PullRequest } from '../generated/types';

export const hasForcePush = (pullRequest: PullRequest) => {
  return pullRequest.timelineItems.edges.some(({ node }) => {
    return 'beforeCommit' in node;
  });
};
