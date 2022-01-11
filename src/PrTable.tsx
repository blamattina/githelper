import React, { useCallback, useState } from 'react';
import { PullRequest, SearchResultItemEdge } from './generated/types';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

const PAGE_SIZE = 15;

const PR_QUERY = loader('./queries/pr-query.graphql');

type Props = {
  authors: string[];
};

function PrTable({ authors }: Props) {
  const [page, setPage] = useState(0);

  const query = `is:PR ${authors.map((a) => `author:${a}`).join(' ')}`;
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

  console.log(data, loading);

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

  // https://mui.com/components/data-grid/columns/
  const columns: GridColDef[] = [
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 225,
      type: 'dateTime',
    },
    { field: 'author', headerName: 'author' },
    { field: 'number', headerName: 'PR Number' },
    { field: 'title', headerName: 'PR Title', width: 500 },
    { field: 'state', headerName: 'State' },
    { field: 'changedFiles', headerName: 'Changed Files' },
    { field: 'additions', headerName: 'Additions' },
    { field: 'deletions', headerName: 'Deletions' },
  ];

  const rows = data.search.edges.map(({ node }: SearchResultItemEdge) => {
    const pullRequest = node as PullRequest;
    return {
      id: pullRequest.id,
      createdAt: new Date(pullRequest.createdAt),
      author: pullRequest.author.login,
      title: pullRequest.title,
      number: pullRequest.number,
      additions: pullRequest.additions,
      deletions: pullRequest.deletions,
      changedFiles: pullRequest.changedFiles,
      state: pullRequest.state,
    };
  });
  return (
    <DataGrid
      loading={loading}
      columns={columns}
      rows={rows}
      pageSize={PAGE_SIZE}
      rowCount={data.search.issueCount}
      onPageChange={onPageChange}
      page={page}
    />
  );
}

export default PrTable;
