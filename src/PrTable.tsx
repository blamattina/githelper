import React from 'react';
import usePrData from './hooks/use-pr-data';
import { PullRequest, SearchResultItemEdge } from './generated/types';
import { DataGrid } from '@mui/x-data-grid';

type Props = {
  authors: string[];
};

function PrTable({ authors }: Props) {
  const { data, loading, error } = usePrData(authors);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>ERROR! {error.message}</div>;

  const columns = [
    { field: 'createdAt', headerName: 'Created At', width: 200 },
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
    console.log(pullRequest);
    return {
      id: pullRequest.id,
      createdAt: pullRequest.createdAt,
      author: pullRequest.author.login,
      title: pullRequest.title,
      number: pullRequest.number,
      additions: pullRequest.additions,
      deletions: pullRequest.deletions,
      changedFiles: pullRequest.changedFiles,
      state: pullRequest.state,
    };
  });
  return <DataGrid columns={columns} rows={rows} rowsPerPageOptions={[50]} />;
}

export default PrTable;
