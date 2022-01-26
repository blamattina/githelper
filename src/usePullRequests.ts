import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import { SearchResultItemEdge, PullRequest } from './generated/types';
import { buildGithubIssueQueryString } from './buildGithubIssueQueryString';
import {
  transformPullRequest,
  PullRequestMetrics,
} from './cycle-time/transformPullRequest';

const PULL_REQUEST_SEARCH = loader('./queries/pr-query.graphql');

type UsePullRequestParams = {
  authors: string[];
  from: Date;
  to: Date;
};

type UsePullRequestsReturnType = {
  loading: boolean;
  pullRequests: PullRequestMetrics[];
};

export function usePullRequests({
  authors,
  from,
  to,
}: UsePullRequestParams): UsePullRequestsReturnType {
  const client = useApolloClient();
  const [loading, setLoading] = useState(true);
  const [pullRequests, setPullRequests] = useState<PullRequestMetrics[]>([]);

  const fetchAllPullRequests = async () => {
    let hasNextPage = true;
    let cursor = null;
    let results: any[] = [];
    const query = buildGithubIssueQueryString({
      authors,
      from,
      to,
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
  };

  useEffect(() => {
    fetchAllPullRequests();
  }, [authors, from, to]);

  return {
    loading,
    pullRequests,
  };
}