import React, { useCallback, useState } from 'react';
import Link from '@mui/material/Link';
import { PullRequest, SearchResultItemEdge } from './generated/types';
import { DataGrid, GridColDef, GridSortItem } from '@mui/x-data-grid';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  buildGithubIssueQueryString,
  SortOrder,
} from './buildGithubIssueQueryString';

const PAGE_SIZE = 15;

const PR_QUERY = loader('./queries/pr-query.graphql');

type Props = {
  authors: string[];
  mentions: string[];
  reviewedBy: string[];
};

// https://mui.com/components/data-grid/columns/
const COLUMNS: GridColDef[] = [
  { field: 'author', headerName: 'Author', sortable: false },
  {
    field: 'locator',
    headerName: 'Locator',
    width: 300,
    sortable: false,
  },
  { field: 'title', headerName: 'Title', width: 500, sortable: false },
  { field: 'state', headerName: 'State', sortable: false },
  {
    field: 'approvals',
    headerName: 'Approvals',
    width: 130,
    sortable: false,
  },
  {
    field: 'comments',
    headerName: 'Comments',
    width: 130,
    sortingOrder: ['asc', 'desc'],
  },
  { field: 'changedFiles', headerName: 'Files', sortable: false },
  { field: 'additions', headerName: 'Additions', sortable: false },
  { field: 'deletions', headerName: 'Deletions', sortable: false },
  {
    field: 'created',
    headerName: 'Created At',
    width: 225,
    sortingOrder: ['asc', 'desc'],
    type: 'dateTime',
  },
  {
    field: 'updated',
    headerName: 'Updated At',
    width: 225,
    sortingOrder: ['asc', 'desc'],
    type: 'dateTime',
  },
];

function PrTable({ authors, mentions, reviewedBy }: Props) {
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([
    { field: 'created', sort: 'desc' },
  ]);

  const sortOrder = sortModel.map((m) => `sort:${m.field}-${m.sort}`).join();

  const query = buildGithubIssueQueryString({
    is: ['PR'],
    authors,
    mentions,
    reviewedBy,
    sortOrder: sortOrder as SortOrder,
  });

  const {
    data = { search: { edges: [] } },
    loading,
    error,
    fetchMore,
  } = useQuery(PR_QUERY, {
    variables: {
      query,
      pageSize: PAGE_SIZE,
    },
    notifyOnNetworkStatusChange: true,
  });

  const onPageChange = useCallback(
    (newPage: number) => {
      if (newPage > page) {
        fetchMore({
          variables: { cursor: data.search.pageInfo.endCursor },
        });
      }
      setPage(newPage);
    },
    [setPage, data]
  );

  if (error) return <div>ERROR! {error.message}</div>;

  const rows = data.search.edges.map(({ node }: SearchResultItemEdge) => {
    const pullRequest = node as PullRequest;
    return {
      id: pullRequest.id,
      created: new Date(pullRequest.createdAt),
      author: pullRequest.author.login,
      title: pullRequest.title,
      number: pullRequest.number,
      locator: `${pullRequest.repository.nameWithOwner}#${pullRequest.number}`,
      approvals: pullRequest.reviews.totalCount,
      comments: pullRequest.comments.totalCount,
      additions: pullRequest.additions,
      deletions: pullRequest.deletions,
      changedFiles: pullRequest.changedFiles,
      state: pullRequest.state,
      updated: new Date(pullRequest.updatedAt),
    };
  });
  return (
    <DataGrid
      loading={loading}
      columns={COLUMNS}
      disableColumnMenu={true}
      rows={rows}
      pageSize={PAGE_SIZE}
      rowCount={data.search.issueCount}
      onSortModelChange={setSortModel}
      onPageChange={onPageChange}
      page={page}
    />
  );
}

export default PrTable;
