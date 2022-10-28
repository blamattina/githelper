import { PullRequest, PullRequestTimelineItemsEdge } from '../generated/types';
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
import getLanguages from './getLanguages';

const maybeDate = (dateString: string | undefined) =>
  dateString ? new Date(dateString) : undefined;

const maybeFilterClosed = (timeline: PullRequestTimelineItemsEdge[]) =>
  timeline.filter(
    (
      element: PullRequestTimelineItemsEdge,
      index: number,
      array: PullRequestTimelineItemsEdge[]
    ) => {
      if (element.node.__typename !== 'ClosedEvent') return true;

      if (index >= 1 && array[index - 1].node.__typename === 'MergedEvent') {
        return false;
      }
      if (
        index < array.length - 1 &&
        array[index + 1].node.__typename === 'MergedEvent'
      ) {
        return false;
      }

      return true;
    }
  );

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
    languages: getLanguages(pullRequest),
    branch: pullRequest.headRefName,
    url: pullRequest.url,
    timeline: maybeFilterClosed(pullRequest.timelineItems.edges),
  };
}
