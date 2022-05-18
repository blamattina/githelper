import format from 'date-fns/format';

type IssueType = 'PR' | 'ISSUE';

export type SortOrder =
  | 'created-asc'
  | 'creaded-desc'
  | 'comments-asc'
  | 'comments-desc'
  | 'updated-asc'
  | 'updated-desc';

export type GithubIssueQuery = {
  is?: IssueType[];
  from: Date;
  to: Date;
  authors?: string[];
  excludeAuthors?: string[];
  teams?: string[];
  mentions?: string[];
  reviewedBy?: string[];
  sortOrder?: SortOrder;
};

export function buildGithubIssueQueryString(query: GithubIssueQuery): string {
  let querySegments = [];

  if (query.is) {
    querySegments.push(query.is.map((i: IssueType) => `is:${i}`));
  }

  if (query.authors) {
    querySegments.push(
      query.authors.map((i: string) => `author:${i}`).join(' ')
    );
  }

  if (query.teams) {
    querySegments.push(query.teams.map((i: string) => `team:${i}`).join(' '));
  }

  if (query.mentions) {
    querySegments.push(
      query.mentions.map((i: string) => `mentions:${i}`).join(' ')
    );
  }

  if (query.reviewedBy) {
    querySegments.push(
      query.reviewedBy.map((i: string) => `reviewed-by:${i}`).join(' ')
    );

    // Filter pulls where reviews were requested but not completed
    querySegments.push('-review:none');
  }

  if (query.excludeAuthors) {
    querySegments.push(
      query.excludeAuthors.map((i: string) => `-author:${i}`).join(' ')
    );
  }

  if (query.from) {
    querySegments.push(
      `updated:${format(query.from, 'yyyy-MM-dd')}..${format(
        query.to,
        'yyyy-MM-dd'
      )}`
    );
  }

  if (query.sortOrder) {
    querySegments.push(query.sortOrder);
  }

  return querySegments.join(' ');
}
