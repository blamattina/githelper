import React, { useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import stc from 'string-to-color';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';

const TEAM_CONTRIBUTIONS_QUERY = loader('./queries/team-contributions.graphql');

type Props = {
  organization: string;
  teamSlug: string;
  startDate: Date;
  endDate: Date;
};

function TeamContributionsRadarChart({
  organization,
  teamSlug,
  startDate,
  endDate,
}: Props) {
  console.log(organization, teamSlug);
  const { data, loading } = useQuery(TEAM_CONTRIBUTIONS_QUERY, {
    variables: {
      organization,
      teamSlug,
      from: startDate,
      to: endDate,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (loading) return <div>Loading</div>;

  const members = data.organization.team.members.nodes.map(
    (member) => member.login
  );

  const chartData = data.organization.team.members.nodes.reduce(
    (acc, member) => {
      acc.codeReview[member.login] =
        member.contributionsCollection.totalPullRequestReviewContributions;
      acc.issues[member.login] =
        member.contributionsCollection.totalIssueContributions;
      acc.pullRequests[member.login] =
        member.contributionsCollection.totalPullRequestContributions;
      acc.commits[member.login] =
        member.contributionsCollection.totalCommitContributions;
      return acc;
    },
    {
      codeReview: {
        subject: 'Code Review',
      },
      issues: {
        subject: 'Issues',
      },
      pullRequests: {
        subject: 'Pull Requests',
      },
      commits: {
        subject: 'Commits',
      },
    }
  );

  console.log(chartData);

  return (
    <>
      <RadarChart
        outerRadius={90}
        width={350}
        height={250}
        data={Object.values(chartData)}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={45} />
        {members.map((member) => (
          <Radar
            key={member}
            name={member}
            dataKey={member}
            stroke={stc(member)}
            fill={stc(member)}
            fillOpacity={0.1}
          />
        ))}
        <Tooltip />
      </RadarChart>
    </>
  );
}

export default TeamContributionsRadarChart;
