import { useState, useEffect, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import { SearchResultItemEdge, PullRequest } from './generated/types';
import { buildGithubIssueQueryString } from './buildGithubIssueQueryString';
import { transformPullRequest } from './cycle-time/transformPullRequest';
import { PullRequestKeyMetrics } from './types';

const PULL_REQUEST_SEARCH = loader('./queries/pr-query.graphql');

type UsePullRequestParams = {
  author?: string;
  reviewedBy?: string[];
  from: Date;
  to: Date;
};

type UsePullRequestsReturnType = {
  loading: boolean;
  pullRequests: PullRequestKeyMetrics[];
};

export function usePullRequests({
  author,
  from,
  to,
  reviewedBy,
}: UsePullRequestParams): UsePullRequestsReturnType {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [pullRequests, setPullRequests] = useState<PullRequestKeyMetrics[]>([]);

  useEffect(() => {
    (async function () {
      setLoading(true);

      let hasNextPage = true;
      let cursor = null;
      let results: any[] = [];
      const query = buildGithubIssueQueryString({
        authors: author ? [author] : [],
        from,
        to,
        reviewedBy,
        is: ['PR'],
      });

      while (hasNextPage) {
        const { data } = await client.query({
          query: PULL_REQUEST_SEARCH,
          variables: {
            pageSize: 40,
            query,
            cursor,
          },
        });

        const {
          search: { edges, pageInfo },
        } = data as any;

        const transformedPullrequests = edges.map(
          ({ node }: SearchResultItemEdge) => {
            return transformPullRequest(node as PullRequest);
          }
        );

        results = results.concat(transformedPullrequests);
        hasNextPage = pageInfo.hasNextPage;
        cursor = pageInfo.endCursor;
      }
      setPullRequests(results);
      setLoading(false);
    })();
  }, [author, from, to, client, reviewedBy]);

  return {
    loading,
    pullRequests,
  };
}
