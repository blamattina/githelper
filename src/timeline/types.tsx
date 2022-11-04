import { PullRequestKeyMetrics } from '../types';
import {
  PullRequestTimelineItems,
  PullRequestTimelineItemsEdge,
} from '../generated/types';

export type TimelineEvent = {
  node: PullRequestTimelineItems;
  pullRequest: PullRequestKeyMetrics;
  ts: number;
};
