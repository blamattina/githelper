import React, { useMemo } from 'react';
import { PullRequestKeyMetrics } from './cycle-time/types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';

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

  const totalCommits: number = useMemo(
    () => pullRequests.reduce((acc, pr) => acc + pr.commits, 0),
    [pullRequests]
  );

  const averageCommits: string = useMemo(() => {
    if (totalCommits > 0) {
      return (totalCommits / pullRequests.length).toFixed(1);
    }
    return '0.0';
  }, [pullRequests, totalCommits]);

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

  const totalLocChanged: number = useMemo(
    () =>
      pullRequests.reduce((acc, pr) => acc + pr.additions + pr.deletions, 0),
    [pullRequests]
  );

  const averageLocChanged: string = useMemo(() => {
    if (totalLocChanged > 0) {
      return (totalLocChanged / pullRequests.length).toFixed(0);
    }

    return '0';
  }, [pullRequests, totalLocChanged]);

  return (
    <table style={{ padding: 1, textAlign: 'center', width: '100%' }}>
      <tr>
        <th></th>
        <th>Total</th>
        <th>Average</th>
      </tr>
      <tr>
        <td>Commits</td>
        <td>{totalCommits}</td>
        <td>{averageCommits}/PR</td>
      </tr>
      <tr>
        <td>Changes</td>
        <td>{totalLocChanged}</td>
        <td>{averageLocChanged}/PR</td>
      </tr>
      <tr>
        <td>PRs</td>
        <td>{pullRequests.length}</td>
        <td>{averageDailyPRs}/Day</td>
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
