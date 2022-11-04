import { PullRequestTimelineItemsEdge } from '../generated/types';
import { PullRequestKeyMetrics } from '../types';
import { TimelineEvent } from './types';

export function getTs(event: PullRequestTimelineItemsEdge) {
  switch (event.node.__typename) {
    case 'PullRequestCommit': {
      return +new Date(event.node.commit.committedDate);
    }

    case 'LabeledEvent':
    case 'MergedEvent':
    case 'ReopenedEvent':
    case 'HeadRefForcePushedEvent':
    case 'ClosedEvent':
    case 'PullRequestReview':
    case 'IssueComment': {
      return +new Date(event.node.createdAt);
    }

    default: {
      return null as never;
    }
  }
}

export function pullReqestToTimelineEvents(
  pullRequest: PullRequestKeyMetrics
): TimelineEvent[] {
  return pullRequest.timeline.map((event) => ({
    node: event.node,
    pullRequest,
    ts: getTs(event),
  }));
}

export function leadingEventInGroup(
  event: TimelineEvent,
  index: number,
  timeline: TimelineEvent[]
) {
  if (index === 0) return true;
  const previousEvent = timeline[index - 1];
  return event.node.__typename !== previousEvent.node.__typename;
}

export function trailingEventInGroup(
  event: TimelineEvent,
  index: number,
  timeline: TimelineEvent[]
) {
  if (index >= timeline.length - 1) return true;
  const nextEvent = timeline[index + 1];
  return event.node.__typename !== nextEvent.node.__typename;
}

export function getKey(event: TimelineEvent) {
  if ('id' in event.node) return event.node.id;
  return event.ts;
}
