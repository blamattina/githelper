import { useState, useEffect, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { loader } from 'graphql.macro';
import { SearchResultItemEdge, PullRequest } from './generated/types';
import { buildGithubIssueQueryString } from './buildGithubIssueQueryString';
import { transformPullRequest } from './cycle-time/transformPullRequest';
import { PullRequestKeyMetrics } from './types';

const PULL_REQUEST_SEARCH = loader('./queries/pr-query.graphql');

type UsePullRequestParams = {
  authors?: string[];
  reviewedBy?: string[];
  excludeAuthors?: string[];
  from: Date;
  to: Date;
  pullRequestSizeLimit?: Number;
};

type UsePullRequestsReturnType = {
  loading: boolean;
  pullRequests: PullRequestKeyMetrics[];
};

export function usePullRequests({
  authors,
  from,
  to,
  reviewedBy,
  excludeAuthors,
  pullRequestSizeLimit = Infinity,
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
        authors,
        from,
        to,
        reviewedBy,
        excludeAuthors,
        is: ['PR'],
      });

      while (hasNextPage) {
        const { data } = await client.query({
          query: PULL_REQUEST_SEARCH,
          variables: {
            pageSize: 100,
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
  }, [authors, from, to, client, reviewedBy, excludeAuthors]);

  const filteredPullRequests = useMemo(() => {
    return pullRequests.filter(
      (pull) => pull.totalCodeChanges <= pullRequestSizeLimit
    );
  }, [pullRequests, pullRequestSizeLimit]);

  return {
    loading,
    pullRequests: filteredPullRequests,
  };
}
