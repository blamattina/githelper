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
import { getCommitToMergeLeadTimes } from '../pull-request/getCommitToMergeLeadTimes';
import { isRevert } from '../pull-request/utils';
import { getMedian, toFixed } from '../utils';

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
  const commitToMergeLeadTimes = getCommitToMergeLeadTimes(pullRequest);
  return {
    id: pullRequest.id,
    author: pullRequest.author.login,
    authorUrl: pullRequest.author.url,
    bodyHTML: pullRequest.bodyHTML,
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
    commitLeadTimes: commitToMergeLeadTimes,
    medianCommitToMerge: commitToMergeLeadTimes.length
      ? toFixed(getMedian(commitToMergeLeadTimes), 1)
      : undefined,
    forcePush: hasForcePush(pullRequest),
    revert: isRevert(pullRequest),
    languages: getLanguages(pullRequest),
    branch: pullRequest.headRefName,
    url: pullRequest.url,
    timeline: maybeFilterClosed(pullRequest.timelineItems.edges),
  };
}
