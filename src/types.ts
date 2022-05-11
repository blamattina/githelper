import { PullRequestState } from './generated/types';

export enum LanguageType {
  Image = 'Image',
  Java = 'Java',
  Javascript = 'Javascript',
  JSON = 'JSON',
  Markdown = 'Markdown',
  Shell = 'Shell Script',
  Typescript = 'Typescript',
  Unknown = 'UNKNOWN',
  Yaml = 'Yaml',
}

export type LanguageMetadata = {
  languageType: LanguageType;
  additions: number;
  deletions: number;
};

export type PullRequestLanguageMetrics = {
  primaryLanguageType: LanguageType;
  languages: LanguageMetadata[];
};

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
  languages: PullRequestLanguageMetrics | null;
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
