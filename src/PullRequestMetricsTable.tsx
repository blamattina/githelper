import React, { useMemo } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import PullRequestTableToolbar from './PullRequestTableToolbar';
import { useGitHubBaseUri } from './useGithubUri';

const PAGE_SIZE = 10;

type Props = {
  pullRequests: any[];
};

// https://mui.com/components/data-grid/columns/
const makeColumns = (gitHubBaseUri: string): GridColDef[] => [
  {
    field: 'created',
    headerName: 'Created At',
    width: 175,
    type: 'dateTime',
  },
  { field: 'title', headerName: 'Pull Request Title', width: 500 },
  {
    field: 'locator',
    headerName: 'Locator',
    width: 300,
    renderCell(params: GridRenderCellParams<string>) {
      const { repo, number, locator } = params.row;
      return (
        <a
          href={`${gitHubBaseUri}/${repo}/issues/${number}`}
          target="_blank"
          rel="noreferrer"
        >
          {locator}
        </a>
      );
    },
  },
  { field: 'state', headerName: 'State' },
  {
    field: 'reviews',
    headerName: 'Reviews',
    width: 130,
  },
  { field: 'commits', headerName: 'Commits' },
  { field: 'changedFiles', headerName: 'Files' },
  { field: 'additions', headerName: 'Additions' },
  { field: 'deletions', headerName: 'Deletions' },
  { field: 'totalCodeChanges', headerName: 'Total Code Changes' },
  {
    field: 'commitToPullRequest',
    headerName: 'Commit to PR',
    type: 'number',
    width: 150,
  },
  {
    field: 'daysToFirstReview',
    headerName: 'Waiting for review',
    type: 'number',
    width: 150,
  },
  {
    field: 'reworkTimeInDays',
    headerName: 'Rework',
    type: 'number',
    width: 150,
  },
  {
    field: 'waitingToDeploy',
    headerName: 'Waiting to deploy',
    type: 'number',
    width: 150,
  },
  { field: 'cycleTime', headerName: 'Cycle Time', type: 'number', width: 150 },
  {
    field: 'deployed',
    headerName: 'Deployment Time',
    type: 'dateTime',
    width: 175,
  },
  {
    field: 'forcePush',
    headerName: 'Force pushed',
    type: 'boolean',
    width: 125,
  },
  { field: 'author', headerName: 'Author' },
];

function PrTable({ pullRequests }: Props) {
  const gitHubBaseUri = useGitHubBaseUri();
  const columns = useMemo(() => makeColumns(gitHubBaseUri), [gitHubBaseUri]);

  return (
    <DataGrid
      columns={columns}
      columnBuffer={columns.length}
      rowsPerPageOptions={[10]}
      disableColumnMenu={true}
      rows={pullRequests}
      pageSize={PAGE_SIZE}
      rowCount={pullRequests.length}
      autoHeight={true}
      density={'compact'}
      components={{ Toolbar: PullRequestTableToolbar }}
    />
  );
}

export default PrTable;
