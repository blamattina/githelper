import { PullRequest } from '../generated/types';
import { getCommits, hasForcePush, isRevert } from './utils';
import { differenceInCalendarDays } from 'date-fns';

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
    differenceInCalendarDays(mergedAt, new Date(commit.commit.committedDate))
  );
}
