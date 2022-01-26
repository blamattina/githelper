import React, { useCallback, useState } from 'react';
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
} from 'recharts';

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
    <>
      <RadarChart outerRadius={90} width={350} height={250} data={chartData}>
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
    </>
  );
}

export default ContributionsRadarChart;
