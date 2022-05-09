import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';
import { PullRequest } from '../generated/types';

import hasForcePush from './hasForcePush';
import getFirstCommittedDateString from './getFirstCommittedDateString';

// Business days between the first commit in the pull request and the pull request open date
export default function commitToPullRequest(
  pullRequest: PullRequest
): number | undefined {
  const firstCommittedDateString = getFirstCommittedDateString(pullRequest);

  // We cant accurately measure commit to pull request if the pull request contains a force push
  if (hasForcePush(pullRequest)) return undefined;

  if (!firstCommittedDateString) return undefined;

  return differenceInBusinessDays(
    new Date(pullRequest.createdAt),
    new Date(firstCommittedDateString)
  );
}
