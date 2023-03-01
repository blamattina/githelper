import {
  PullRequest,
  PullRequestCommit,
  PullRequestTimelineItems,
} from '../generated/types';
import { isForcePush, isPullRequestCommit } from './timeline-item-type-guards';

export function getPullRequestTimelineItems(
  pullRequest: PullRequest
): PullRequestTimelineItems[] {
  return pullRequest.timelineItems.edges.map((edge) => edge.node);
}

export function getCommits(pullRequest: PullRequest): PullRequestCommit[] {
  const timelineItems = getPullRequestTimelineItems(pullRequest);
  return timelineItems.filter<PullRequestCommit>(isPullRequestCommit);
}

export function hasForcePush(pullRequest: PullRequest): boolean {
  const timelineItems = getPullRequestTimelineItems(pullRequest);
  return timelineItems.some(isForcePush);
}

export function isRevert(pullRequest: PullRequest): boolean {
  return pullRequest.title.startsWith('Revert "');
}
