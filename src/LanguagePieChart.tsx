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

function getLanguagePieData(pullRequests: PullRequestKeyMetrics[]) {
  const pullLanguageCounter: any = {};
  let colorCounter = 0;
  pullRequests.forEach((pull) => {
    if (pull.languages?.primaryLanguageType) {
      if (pullLanguageCounter[pull.languages.primaryLanguageType]) {
        pullLanguageCounter[pull.languages.primaryLanguageType].counter++;
      } else {
        pullLanguageCounter[pull.languages.primaryLanguageType] = {
          counter: 1,
          color: COLORS[colorCounter],
        };
        colorCounter++;
        if (colorCounter > COLORS.length - 1) {
          colorCounter = 0;
        }
      }
    }
  });

  const languagePieData = Object.keys(pullLanguageCounter).map((key) => {
    return {
      name: key,
      value: pullLanguageCounter[key].counter,
      color: pullLanguageCounter[key].color,
    };
  });

  return languagePieData;
}

function LanguagePieChart({ authoredPullRequests }: Props) {
  const languagePieData = useMemo(
    () => getLanguagePieData(authoredPullRequests),
    [authoredPullRequests]
  );

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={300}>
        <PieChart>
          <Legend
            wrapperStyle={{ fontSize: '12px', overflow: 'scroll' }}
            height={70}
          />
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
          <Pie data={languagePieData} dataKey="value" outerRadius={80}>
            {languagePieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default LanguagePieChart;
