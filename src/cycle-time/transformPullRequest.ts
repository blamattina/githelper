import { PullRequest } from '../generated/types';
import {
  reworkTimeInDays,
  daysToFirstReview,
  waitingToDeploy,
  cycleTime,
  findDeploymentTime,
} from './reviewTime';
import commitToPullRequest from './commitToPullRequest';
import hasForcePush from './hasForcePush';

import { PullRequestKeyMetrics } from '../types';

const maybeDate = (dateString: string | undefined) =>
  dateString ? new Date(dateString) : undefined;

export function transformPullRequest(
  pullRequest: PullRequest
): PullRequestKeyMetrics {
  return {
    id: pullRequest.id,
    author: pullRequest.author.login,
    locator: `${pullRequest.repository.nameWithOwner}#${pullRequest.number}`,
    repo: pullRequest.repository.nameWithOwner,
    number: pullRequest.number,
    title: pullRequest.title,
    bodyHTML: pullRequest.bodyHTML,
    state: pullRequest.state,
    reviews: pullRequest.reviews.totalCount,
    commits: pullRequest.commits.totalCount,
    additions: pullRequest.additions,
    deletions: pullRequest.deletions,
    totalCodeChanges: pullRequest.additions + pullRequest.deletions,
    changedFiles: pullRequest.changedFiles,
    created: new Date(pullRequest.createdAt),
    merged: maybeDate(pullRequest.mergedAt),
    deployed: maybeDate(
      findDeploymentTime(pullRequest) || pullRequest.mergedAt
    ),
    commitToPullRequest: commitToPullRequest(pullRequest),
    daysToFirstReview: daysToFirstReview(pullRequest),
    reworkTimeInDays: reworkTimeInDays(pullRequest),
    waitingToDeploy: waitingToDeploy(pullRequest),
    cycleTime: cycleTime(pullRequest),
    forcePush: hasForcePush(pullRequest),
  };
}
