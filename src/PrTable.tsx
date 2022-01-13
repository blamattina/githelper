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
import { diffDateString } from './cycle-time/diffDateStrings';
import { getFirstApprovalAt } from './cycle-time/getFirstApprovalAt';
import { getEarliestCommitAt } from './cycle-time/getEarliestCommitAt';
import { hasForcePush } from './cycle-time/hasForcePush';

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
  { field: 'forcePush', headerName: 'Force Push', width: 130, sortable: false },
  {
    field: 'earlistCommitToPrCreated',
    headerName: 'Commit to PR',
    width: 150,
    sortable: false,
  },
  {
    field: 'prCreatedToApproved',
    headerName: 'PR to Approval',
    width: 150,
    sortable: false,
  },
  {
    field: 'approvedToMerged',
    headerName: 'Approved to Merged',
    width: 150,
    sortable: false,
  },
  { field: 'cycleTime', headerName: 'Cycle Time', width: 150, sortable: false },
  {
    field: 'created',
    headerName: 'Created At',
    width: 225,
    sortingOrder: ['asc', 'desc'],
    type: 'dateTime',
  },
  {
    field: 'earlistCommit',
    headerName: 'Earliest Commit At',
    width: 225,
    type: 'dateTime',
    sortable: false,
  },
  {
    field: 'approved',
    headerName: 'Approved At',
    width: 225,
    type: 'dateTime',
    sortable: false,
  },
  {
    field: 'merged',
    headerName: 'Merged At',
    width: 225,
    type: 'dateTime',
    sortable: false,
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
    const approvedAt = getFirstApprovalAt(pullRequest.reviews);
    const earlistCommitAt = getEarliestCommitAt(pullRequest);
    return {
      id: pullRequest.id,
      author: pullRequest.author.login,
      locator: `${pullRequest.repository.nameWithOwner}#${pullRequest.number}`,
      title: pullRequest.title,
      state: pullRequest.state,
      approvals: pullRequest.reviews.totalCount,
      comments: pullRequest.comments.totalCount,
      additions: pullRequest.additions,
      deletions: pullRequest.deletions,
      changedFiles: pullRequest.changedFiles,
      forcePush: hasForcePush(pullRequest),
      created: new Date(pullRequest.createdAt),
      earlistCommit: new Date(earlistCommitAt),
      approved: approvedAt && new Date(approvedAt),
      merged: new Date(pullRequest.mergedAt),
      updated: new Date(pullRequest.updatedAt),
      earlistCommitToPrCreated: diffDateString(
        pullRequest.createdAt,
        earlistCommitAt
      ),
      prCreatedToApproved: diffDateString(approvedAt, pullRequest.createdAt),
      approvedToMerged: diffDateString(pullRequest.mergedAt, approvedAt),
      cycleTime: diffDateString(pullRequest.mergedAt, earlistCommitAt),
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
