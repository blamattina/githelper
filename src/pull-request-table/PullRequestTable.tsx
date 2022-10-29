import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Iso,
  InsertDriveFileOutlined,
  CommitOutlined,
  ReviewsOutlined,
  PublishedWithChangesOutlined,
  Check,
  Close,
} from '@mui/icons-material';
import {
  Collapse,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import { PullRequestKeyMetrics } from '../types';
import PullRequestRowTimeline from './PullRequestRowTimeline';
import TotalCodeChanges from './TotalCodeChanges';
import { ReactComponent as ForcePush } from './force-push.svg';
import PullRequestStateChip from './PullRequestStateChip';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
};

export default function PullRequestTable({ pullRequests }: Props) {
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell></TableCell>
          <TableCell align="center">Created</TableCell>
          <TableCell align="center">Author</TableCell>
          <TableCell>Title</TableCell>
          <TableCell align="center">State</TableCell>
          <TableCell align="center">Language</TableCell>
          <TableCell align="center">
            <Tooltip title="Number of times the Pull Request was reviewed">
              <ReviewsOutlined />
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title="Number of commits">
              <CommitOutlined />
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title="Number of files changed">
              <InsertDriveFileOutlined />
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title="Additions and subtractions">
              <Iso />
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title="Cycle time from open to close">
              <PublishedWithChangesOutlined />
            </Tooltip>
          </TableCell>
          <TableCell align="center">
            <Tooltip title="True if the pull request contains a force push">
              <ForcePush style={{ height: 22, width: 22 }} />
            </Tooltip>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {pullRequests
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((pull) => (
            <>
              <TableRow key={`${pull.id}-row`}>
                <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => {
                      if (openRowId === pull.id) {
                        setOpenRowId(null);
                      } else {
                        setOpenRowId(pull.id);
                      }
                    }}
                  >
                    {pull.id === openRowId ? (
                      <KeyboardArrowDown fontSize="small" />
                    ) : (
                      <KeyboardArrowRight fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {format(pull.created, 'yyyy-MM-dd')}
                  </span>
                </TableCell>
                <TableCell align="center">{pull.author}</TableCell>
                <TableCell>
                  <div
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 500,
                    }}
                  >
                    <Link href={pull.url} target="_blank">
                      {pull.repo}#{pull.number}: {pull.title}
                    </Link>
                  </div>
                </TableCell>
                <TableCell align="center">
                  <PullRequestStateChip state={pull.state} />
                </TableCell>
                <TableCell align="center">
                  {pull.languages?.primaryLanguageType}
                </TableCell>
                <TableCell align="center">{pull.reviews}</TableCell>
                <TableCell align="center">{pull.commits}</TableCell>
                <TableCell align="center">{pull.changedFiles}</TableCell>
                <TableCell align="center">
                  <TotalCodeChanges
                    additions={pull.additions}
                    deletions={pull.deletions}
                    totalCodeChanges={pull.totalCodeChanges}
                  />
                </TableCell>
                <TableCell align="center">{pull.cycleTime}</TableCell>
                <TableCell align="center">
                  {pull.forcePush ? <Check /> : <Close />}
                </TableCell>
              </TableRow>
              <TableRow key={`${pull.id}-detail`}>
                <TableCell
                  colSpan={12}
                  style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 0 }}
                >
                  <Collapse
                    in={openRowId === pull.id}
                    timeout="auto"
                    unmountOnExit
                  >
                    <PullRequestRowTimeline pullRequest={pull} />
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            rowsPerPageOptions={[50, 100, { label: 'All', value: -1 }]}
            colSpan={12}
            count={pullRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}
