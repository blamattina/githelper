import { PullRequestCommit, PullRequest } from '../generated/types';

// Find the first commit in the PR and return its committed date string
export default function getFirstCommittedDateString(
  pullRequest: PullRequest
): string | undefined {
  const firstCommitNode = pullRequest.timelineItems.edges.find(
    ({ node }) => 'commit' in node
  )?.node as PullRequestCommit | undefined;

  if (!firstCommitNode) return undefined;
  return firstCommitNode.commit.committedDate;
}
