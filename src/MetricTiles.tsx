import { Box, Grid, Paper } from '@mui/material';
import { PullRequestKeyMetrics } from './types';
import { styled } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  reviewedPullRequests: PullRequestKeyMetrics[];
};

const TileContainer = styled(Grid)(({ theme }) => ({
  height: '100%',
}));

const Tile = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: '#000000',
  height: '100%',
}));

const MetricValue = styled('div')(({ theme }) => ({
  fontSize: 60,
  lineHeight: 1.25,
}));

const getAverage = (arr: number[]) => {
  return Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1));
};

const renderTileValue = (
  title: string,
  value: any,
  helpText: string,
  unit: string
) => {
  return (
    <Tooltip title={helpText} enterDelay={500}>
      <Tile elevation={0}>
        <div>{title}</div>
        <MetricValue>{value}</MetricValue>
        {unit}
      </Tile>
    </Tooltip>
  );
};

function MetricTiles({ pullRequests, reviewedPullRequests }: Props) {
  const authoredCycleTimes: number[] = pullRequests
    .filter(
      (pull) => pull.state === 'MERGED' && typeof pull.cycleTime === 'number'
    )
    .map((pull) => pull.cycleTime as number);

  const reviewResponseTimes: number[] = reviewedPullRequests
    .filter(
      (pull) =>
        pull.state === 'MERGED' && typeof pull.daysToFirstReview === 'number'
    )
    .map((pull) => pull.daysToFirstReview as number);

  const openPullRequests = pullRequests.filter(
    (pull) => pull.state === 'OPEN'
  ).length;

  const mergedPullRequests = pullRequests.filter(
    (pull) => pull.state === 'MERGED'
  ).length;

  const closedPullRequests = pullRequests.filter(
    (pull) => pull.state === 'CLOSED'
  ).length;

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <TileContainer container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Total',
            pullRequests.length,
            'Total pull requests that this user has authored',
            'Pull Requets'
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Open',
            openPullRequests,
            'Total pull requests that this user currently has open',
            'Pull Requets'
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Merged',
            mergedPullRequests,
            'Total pull requests that this user opened and later merged',
            'Pull Requets'
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Closed',
            closedPullRequests,
            'Total pull requests that this user opened and later closed',
            'Pull Requets'
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'PR Open to Close',
            authoredCycleTimes.length > 0
              ? Math.round(getAverage(authoredCycleTimes) * 100) / 100
              : '-',
            'As an author: average business days between the PR opening and deployment/merge',
            'Business Days'
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Review Delay',
            reviewResponseTimes.length > 0
              ? getAverage(reviewResponseTimes)
              : '-',
            'As a Reviewer: average business days it takes for PRs to recieve their first review',
            'Business Days'
          )}
        </Grid>
      </TileContainer>
    </Box>
  );
}

export default MetricTiles;
