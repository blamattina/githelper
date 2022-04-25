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
};

export type PullRequestKeyMetricsNames = keyof PullRequestKeyMetrics;
