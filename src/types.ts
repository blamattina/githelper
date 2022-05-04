import { PullRequestState } from './generated/types';

export type PullRequestKeyMetrics = {
  id: string;
  author: string;
  locator: string;
  title: string;
  repo: string;
  number: number;
  commits: number;
  state: PullRequestState;
  reviews: number;
  additions: number;
  deletions: number;
  totalCodeChanges: number;
  changedFiles: number;
  created: Date;
  deployed?: Date;
  merged?: Date;
  cycleTime?: number;
  commitToMerge?: number;
  commitToPullRequest?: number;
  daysToFirstReview?: number;
  reworkTimeInDays?: number;
  waitingToDeploy?: number;
  forcePush: boolean;
};

export type PullRequestKeyMetricsNames = keyof PullRequestKeyMetrics;

export type PullRequestWeekActivitySummary = {
  name: string;
  weekString: string;
  pulls: PullRequestKeyMetrics[];
  cycleTime: number;
  commitToPullRequest: number;
  daysToFirstReview: number;
  waitingToDeploy: number;
  reworkTimeInDays: number;
  closed: number;
  created: number;
  merged: number;
  wip: number;
};

export type PullRequestActivitySummary = PullRequestWeekActivitySummary[];
