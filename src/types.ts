import {
  PullRequestState,
  PullRequestTimelineItemsEdge,
} from './generated/types';

export enum LanguageType {
  Image = 'Image',
  Dockerfile = 'Dockerfile',
  Jade = 'Jade',
  Java = 'Java',
  Javascript = 'Javascript',
  JSON = 'JSON',
  Markdown = 'Markdown',
  Maven = 'Maven',
  Patch = 'Patch',
  Python = 'Python',
  Ruby = 'Ruby',
  Sass = 'Sass',
  Shell = 'Shell Script',
  Typescript = 'Typescript',
  Unknown = 'UNKNOWN',
  XML = 'XML',
  Yaml = 'Yaml',
  Yarn = 'Yarn',
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
  authorUrl: string;
  bodyHTML: string;
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
  commitLeadTimes: number[];
  medianCommitToMerge?: number;
  forcePush: boolean;
  revert: boolean;
  languages: PullRequestLanguageMetrics | null;
  timeline: PullRequestTimelineItemsEdge[];
  url: string;
  branch: string;
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
