import takeWhile from 'lodash/takeWhile';
import keyBy from 'lodash/keyBy';
import { PullRequestCommit, PullRequest } from '../generated/types';

export const getEarliestCommitAt = (pullRequest: PullRequest) => {
  const node = pullRequest.timelineItems.edges.find(
    ({ node }) => 'commit' in node
  )?.node as PullRequestCommit | undefined;

  if (!node) return undefined;
  return node.commit.committedDate;
};
