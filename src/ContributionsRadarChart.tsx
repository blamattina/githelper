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
import { Paper, Typography } from '@mui/material';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import { differenceInDays } from 'date-fns';

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

  /* If data does not return due to asking for over a year, show a fail state
   * Future optimization should be to page through year at a time and
   * combine, but this prevents a page crash
   */
  if (!data.user && differenceInDays(endDate, startDate) > 365) {
    return (
      <Paper elevation={0} sx={{ height: '100%', padding: '50px' }}>
        <Typography
          align="center"
          variant="h5"
          sx={{ paddingLeft: '50px', paddingRight: '50px' }}
        >
          Cannot Support More than a Years Data
        </Typography>
        <Typography align="center">
          <DataThresholdingIcon sx={{ height: 150, width: 150 }}>
            Testing this is longer
          </DataThresholdingIcon>
        </Typography>
      </Paper>
    );
  }

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
