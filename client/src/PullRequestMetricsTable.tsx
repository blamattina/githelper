import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const PAGE_SIZE = 10;

type Props = {
  pullRequests: any[];
};

// https://mui.com/components/data-grid/columns/
const COLUMNS: GridColDef[] = [
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
          href={`https://git.hubteam.com/${repo}/issues/${number}`}
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
  {
    field: 'commitToPullRequest',
    headerName: 'Development',
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
  { field: 'author', headerName: 'Author' },
];

function PrTable({ pullRequests }: Props) {
  return (
    <DataGrid
      columns={COLUMNS}
      columnBuffer={COLUMNS.length}
      rowsPerPageOptions={[10]}
      disableColumnMenu={true}
      rows={pullRequests}
      pageSize={PAGE_SIZE}
      rowCount={pullRequests.length}
      autoHeight={true}
      density={'compact'}
    />
  );
}

export default PrTable;
