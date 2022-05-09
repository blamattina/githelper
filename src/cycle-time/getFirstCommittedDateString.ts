import takeWhile from 'lodash/takeWhile';
import keyBy from 'lodash/keyBy';
import { PullRequestCommit, PullRequest } from '../generated/types';

export default function getFirstCommittedDateString(pullRequest: PullRequest): string {
  // Find the first commit node in the timeline.
  const firstCommitNode = pullRequest.timelineItems.edges.find(
    ({ node }) => 'commit' in node
  )?.node as PullRequestCommit | undefined;

  if (!firstCommitNode) return undefined;
  return firstCommitNode.commit.committedDate;
};
