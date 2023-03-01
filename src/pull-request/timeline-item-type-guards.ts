import {
  HeadRefForcePushedEvent,
  PullRequestCommit,
  PullRequestTimelineItems,
} from '../generated/types';

export function isPullRequestCommit(
  item: PullRequestTimelineItems
): item is PullRequestCommit {
  return item.__typename == 'PullRequestCommit';
}

export function isForcePush(
  item: PullRequestTimelineItems
): item is HeadRefForcePushedEvent {
  return item.__typename == 'HeadRefForcePushedEvent';
}
