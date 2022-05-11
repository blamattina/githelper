import React, { useMemo } from 'react';
import { Link as ReactDomLink, useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import format from 'date-fns/format';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import PullRequestTableToolbar from './PullRequestTableToolbar';
import { useGitHubBaseUri } from './useGithubUri';

const PAGE_SIZE = 10;

const LinkStyle = {
  margin: 0,
  color: '#1976d2',
  WebkitTextDecoration: 'none',
  textDecoration: 'none',
};

type Props = {
  pullRequests: any[];
};

// https://mui.com/components/data-grid/columns/
const makeColumns = (
  gitHubBaseUri: string,
  gitHubHostname: string | undefined
): GridColDef[] => [
  {
    field: 'created',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Created At',
    width: 120,
    type: 'dateTime',
    renderCell: (params: GridRenderCellParams<Date>) => {
      const { created } = params.row;
      return (
        <Tooltip title={format(created, 'PPpp')} enterDelay={1000}>
          <span>{format(created, 'P')}</span>
        </Tooltip>
      );
    },
  },
  {
    field: 'title',
    headerName: 'Pull Request',
    width: 600,
    renderCell(params: GridRenderCellParams<string>) {
      const { repo, number, title } = params.row;
      return (
        <Link
          href={`${gitHubBaseUri}/${repo}/issues/${number}`}
          underline="none"
          target="_blank"
          rel="noreferrer"
        >
          {repo} {number}: {title}
        </Link>
      );
    },
  },
  {
    field: 'state',
    align: 'center',
    headerAlign: 'center',
    headerName: 'State',
  },
  {
    field: 'reviews',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Reviews',
    width: 100,
  },
  {
    field: 'commits',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Commits',
    width: 100,
  },
  {
    field: 'changedFiles',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Files',
    width: 80,
  },
  {
    field: 'totalCodeChanges',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Code Changes',
    width: 120,
    renderCell(params: GridRenderCellParams<number>) {
      const { totalCodeChanges, additions, deletions } = params.row;
      return (
        <Tooltip
          title={`Additions ${additions} Deletions: ${deletions}`}
          enterDelay={1000}
        >
          <span>{totalCodeChanges}</span>
        </Tooltip>
      );
    },
  },
  {
    field: 'cycleTime',
    align: 'center',
    headerAlign: 'center',
    headerName: 'PR Cycle Time',
    description:
      'Business days between the pull request opening and it being merged or deployed',
    type: 'number',
    width: 150,
  },
  {
    field: 'commitToPullRequest',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Commit to PR',
    description:
      'Business days between the first commit and the pull request being opened',
    type: 'number',
    width: 150,
  },
  {
    field: 'daysToFirstReview',
    align: 'center',
    headerAlign: 'center',
    headerName: 'PR to First Review',
    description:
      'Business days between the pull request opening and the first review',
    type: 'number',
    width: 150,
  },
  {
    field: 'reworkTimeInDays',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Review time',
    description: 'Business days between the first review and the last review',
    type: 'number',
    width: 150,
  },
  {
    field: 'waitingToDeploy',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Waiting to deploy',
    description: 'Business days between the last review and deployment/merge',
    type: 'number',
    width: 150,
  },
  {
    field: 'deployed',
    align: 'center',
    headerAlign: 'center',
    headerName: 'Deployment',
    type: 'dateTime',
    width: 100,
    renderCell: (params: GridRenderCellParams<Date>) => {
      const { deployed } = params.row;
      if (!deployed) return undefined;
      return (
        <Tooltip title={format(deployed, 'PPpp')} enterDelay={1000}>
          <span>{format(deployed, 'P')}</span>
        </Tooltip>
      );
    },
  },
  {
    field: 'forcePush',
    headerName: 'Force pushed',
    description: 'True if the pull request contains a force push',
    type: 'boolean',
    width: 125,
  },
  {
    field: 'author',
    headerName: 'Author',
    renderCell(params: GridRenderCellParams<string>) {
      const { author } = params.row;
      return (
        <ReactDomLink
          to={`/${gitHubHostname}/users/${author}`}
          replace
          style={LinkStyle}
        >
          {author}
        </ReactDomLink>
      );
    },
  },
];

function PrTable({ pullRequests }: Props) {
  const gitHubBaseUri = useGitHubBaseUri();
  const { gitHubHostname } = useParams();
  const columns = useMemo(
    () => makeColumns(gitHubBaseUri, gitHubHostname),
    [gitHubBaseUri, gitHubHostname]
  );

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
