import React from 'react';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Paper from '@mui/material/Paper';

const USER_CONTRIBUTIONS_QUERY = loader('./queries/user-contributions.graphql');

type Props = {
  author: string;
  startDate: Date;
  endDate: Date;
};

function ContributionsRadarChart({ author, startDate, endDate }: Props) {
  const { data = { userContributionsCollection: {} }, loading } = useQuery(
    USER_CONTRIBUTIONS_QUERY,
    {
      variables: {
        user: author,
        from: startDate,
        to: endDate,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  if (loading) return <div>Loading</div>;

  const {
    totalCommitContributions,
    totalPullRequestContributions,
    totalPullRequestReviewContributions,
    totalIssueContributions,
  } = data.user.contributionsCollection;

  const chartData = [
    {
      subject: 'Code Review',
      [author]: totalPullRequestReviewContributions,
    },
    {
      subject: 'Issues',
      [author]: totalIssueContributions,
    },
    {
      subject: 'Pull Requests',
      [author]: totalPullRequestContributions,
    },
    {
      subject: 'Commits',
      [author]: totalCommitContributions,
    },
  ];

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={300}>
        <RadarChart outerRadius={90} data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={45} domain={[0, 50]} />
          <Radar
            name={author}
            dataKey={author}
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default ContributionsRadarChart;
