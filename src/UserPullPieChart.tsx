import { Paper } from '@mui/material';
import {
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
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
  pullRequests.forEach((pull) => {
    if (pullAuthorCounter[pull.author]) {
      pullAuthorCounter[pull.author] = pullAuthorCounter[pull.author] + 1;
    } else {
      pullAuthorCounter[pull.author] = 1;
    }
  });

  const authorPieData = Object.keys(pullAuthorCounter).map((key) => {
    return { name: key, value: pullAuthorCounter[key] };
  });

  return authorPieData;
}

function UserPullPieChart({ authoredPullRequests }: Props) {
  const authoredPieData = getPullPieData(authoredPullRequests);

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={350}>
        <PieChart>
          <Legend />
          <Tooltip />
          <Pie
            data={authoredPieData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
          >
            <LabelList dataKey="name" />
            {authoredPieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default UserPullPieChart;
