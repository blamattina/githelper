import React, { useMemo } from 'react';
import { PullRequestKeyMetrics } from './cycle-time/types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';
import { sum, mean, stdev, percentile } from 'stats-lite';

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

  const commits: number[] = useMemo(() => pullRequests.map(pr => pr.commits), [pullRequests]);
  const commitsTotal: number[] = useMemo(() => sum(commits), [commits]);
  const commits50th: number = useMemo(() => percentile(commits, 0.5).toFixed(1), [commits]);
  const commits75th: number = useMemo(() => percentile(commits, 0.75).toFixed(1), [commits]);
  const commits95th: number = useMemo(() => percentile(commits, 0.95).toFixed(1), [commits]);
  const commits99th: number = useMemo(() => percentile(commits, 0.99).toFixed(1), [commits]);


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

  const changes: number[] = useMemo(() => pullRequests.map(pr => pr.additions + pr.deletions), [pullRequests]);
  const changesTotal: number = useMemo(() => sum(changes), [changes]);
  const changes50th: number = useMemo(() => percentile(changes, 0.5).toFixed(1), [changes]);
  const changes75th: number = useMemo(() => percentile(changes, 0.75).toFixed(1), [changes]);
  const changes95th: number = useMemo(() => percentile(changes, 0.95).toFixed(1), [changes]);
  const changes99th: number = useMemo(() => percentile(changes, 0.99).toFixed(1), [changes]);

  if (!pullRequests.length) return <div>No Data</div>

  return (
    <table style={{ padding: 1, textAlign: 'center', width: '100%' }}>
      <tr>
        <th></th>
        <th>Total</th>
        <th>50th</th>
        <th>75th</th>
        <th>95th</th>
        <th>99th</th>
      </tr>
      <tr>
        <td>Commits</td>
        <td>{commitsTotal}</td>
        <td>{commits50th}</td>
        <td>{commits75th}</td>
        <td>{commits95th}</td>
        <td>{commits99th}</td>
      </tr>
      <tr>
        <td>Changes</td>
        <td>{changesTotal}</td>
        <td>{changes50th}</td>
        <td>{changes75th}</td>
        <td>{changes95th}</td>
        <td>{changes99th}</td>
      </tr>
      <tr>
        <td>PRs</td>
        <td>{pullRequests.length}</td>
        <td colspan={4}>{averageDailyPRs}/Day</td>
      </tr>
      <tr>
        <td>Small PRs</td>
        <td>
          {countOfSmallPRs} ({percentageOfSmallPRs}%)
        </td>
      </tr>
    </table>
  );
}

export default HighLevelMetrics;
