import { useMemo } from 'react';
import { Paper } from '@mui/material';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PULL_REQUEST_CHANGESET_LIMIT } from './constants';
import { PullRequestKeyMetrics } from './types';

const COLORS = [
  '#e60049',
  '#0bb4ff',
  '#50e991',
  '#e6d800',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
];
type Props = {
  authoredPullRequests: PullRequestKeyMetrics[];
};

function getPullPieData(pullRequests: PullRequestKeyMetrics[]) {
  const pullAuthorCounter: any = {};
  let colorCounter = 0;
  pullRequests.forEach((pull) => {
    if (pullAuthorCounter[pull.author]) {
      pullAuthorCounter[pull.author].value++;
      if (pull.totalCodeChanges <= PULL_REQUEST_CHANGESET_LIMIT) {
        pullAuthorCounter[pull.author].totalCodeChanges +=
          pull.totalCodeChanges;
      }
    } else {
      pullAuthorCounter[pull.author] = {
        value: 1,
        totalCodeChanges: pull.totalCodeChanges,
        color: COLORS[colorCounter],
      };
      colorCounter++;
      if (colorCounter > COLORS.length - 1) {
        colorCounter = 0;
      }
    }
  });

  const authorPieData = Object.keys(pullAuthorCounter).map((key) => {
    return {
      name: key,
      value: pullAuthorCounter[key].value,
      totalCodeChanges: pullAuthorCounter[key].totalCodeChanges,
      color: pullAuthorCounter[key].color,
    };
  });

  return authorPieData;
}

function UserPullPieChart({ authoredPullRequests }: Props) {
  const authoredPieData = useMemo(
    () => getPullPieData(authoredPullRequests),
    [authoredPullRequests]
  );

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={300}>
        <PieChart>
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Tooltip
            formatter={(value: any, name: any, props: any) => {
              if (props.dataKey === 'totalCodeChanges') {
                return `${value.toLocaleString('en-US')} lines of code changed`;
              } else if (props.dataKey === 'value') {
                return `${value.toLocaleString('en-US')} pull requests opened`;
              }
              return value;
            }}
          />
          <Pie data={authoredPieData} dataKey="value" outerRadius={50}>
            {authoredPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Pie
            data={authoredPieData}
            dataKey="totalCodeChanges"
            innerRadius={60}
            outerRadius={80}
            legendType="none"
          >
            {authoredPieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default UserPullPieChart;
