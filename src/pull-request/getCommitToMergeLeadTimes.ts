import { PullRequest } from '../generated/types';
import { toFixed } from '../utils';
import { getCommits, hasForcePush, isRevert } from './utils';
import { differenceInMinutes } from 'date-fns';

export function getCommitToMergeLeadTimes(pullRequest: PullRequest): number[] {
  const commits = getCommits(pullRequest);
  const mergedAt = new Date(pullRequest.mergedAt);
  if (
    hasForcePush(pullRequest) ||
    isRevert(pullRequest) ||
    !pullRequest.merged ||
    !commits.length
  ) {
    return [];
  }

  return commits.map((commit) =>
    toFixed(
      differenceInMinutes(mergedAt, new Date(commit.commit.committedDate)) /
        60 /
        24,
      1
    )
  );
}
