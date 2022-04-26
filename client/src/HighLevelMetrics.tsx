import React, { useMemo } from 'react';
import { PullRequestKeyMetrics } from './types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';
import { sum, percentile } from 'stats-lite';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
};

const SMALL_PR = 25; // additions + deletions

function HighLevelMetrics({ pullRequests, startDate, endDate }: Props) {
  const weekDaysInRange: number = useMemo(
    () => differenceInBusinessDays(endDate, startDate),
    [startDate, endDate]
  );

  const averageDailyPRs: string = useMemo(() => {
    if (weekDaysInRange === 0) return `${pullRequests.length}`;

    if (pullRequests.length) {
      return (pullRequests.length / weekDaysInRange).toFixed(1);
    }
    return '0.0';
  }, [pullRequests, weekDaysInRange]);

  const commits: number[] = useMemo(
    () => pullRequests.map((pr) => pr.commits),
    [pullRequests]
  );
  const commitsTotal: number = useMemo(() => sum(commits), [commits]);
  const commits50th: string = useMemo(
    () => percentile(commits, 0.5).toFixed(1),
    [commits]
  );
  const commits75th: string = useMemo(
    () => percentile(commits, 0.75).toFixed(1),
    [commits]
  );
  const commits95th: string = useMemo(
    () => percentile(commits, 0.95).toFixed(1),
    [commits]
  );
  const commits99th: string = useMemo(
    () => percentile(commits, 0.99).toFixed(1),
    [commits]
  );

  const countOfSmallPRs: number = useMemo(
    () =>
      pullRequests.filter((pr) => pr.additions + pr.deletions <= SMALL_PR)
        .length,
    [pullRequests]
  );

  const percentageOfSmallPRs: string = useMemo(() => {
    if (countOfSmallPRs > 0) {
      return ((countOfSmallPRs / pullRequests.length) * 100).toFixed(0);
    }
    return '0';
  }, [pullRequests, countOfSmallPRs]);

  const changes: number[] = useMemo(
    () => pullRequests.map((pr) => pr.additions + pr.deletions),
    [pullRequests]
  );
  const changesTotal: number = useMemo(() => sum(changes), [changes]);
  const changes50th: string = useMemo(
    () => percentile(changes, 0.5).toFixed(1),
    [changes]
  );
  const changes75th: string = useMemo(
    () => percentile(changes, 0.75).toFixed(1),
    [changes]
  );
  const changes95th: string = useMemo(
    () => percentile(changes, 0.95).toFixed(1),
    [changes]
  );
  const changes99th: string = useMemo(
    () => percentile(changes, 0.99).toFixed(1),
    [changes]
  );

  if (!pullRequests.length) return <div>No Data</div>;

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell>50th</TableCell>
            <TableCell>75th</TableCell>
            <TableCell>95th</TableCell>
            <TableCell>99th</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Commits</TableCell>
            <TableCell>{commitsTotal}</TableCell>
            <TableCell>{commits50th}</TableCell>
            <TableCell>{commits75th}</TableCell>
            <TableCell>{commits95th}</TableCell>
            <TableCell>{commits99th}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Changes</TableCell>
            <TableCell>{changesTotal}</TableCell>
            <TableCell>{changes50th}</TableCell>
            <TableCell>{changes75th}</TableCell>
            <TableCell>{changes95th}</TableCell>
            <TableCell>{changes99th}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default HighLevelMetrics;
