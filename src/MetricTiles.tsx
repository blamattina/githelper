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
  fontSize: 80,
  lineHeight: 1.25,
}));

//TODO - these should be a utility class
const getMedian = (arr: number[]) => {
  let middle = Math.floor(arr.length / 2);
  arr = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0
    ? arr[middle]
    : (arr[middle - 1] + arr[middle]) / 2;
};

const getAverage = (arr: number[]) => {
  return Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1));
};

const getHighest = (arr: number[]) => {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  }, -Infinity);
};

const renderTileValue = (title: string, value: any, helpText: string) => {
  return (
    <Tooltip title={helpText} enterDelay={500}>
      <Tile elevation={0}>
        <div>{title}</div>
        <MetricValue>{value}</MetricValue>
      </Tile>
    </Tooltip>
  );
};

function MetricTiles({ pullRequests, reviewedPullRequests }: Props) {
  const authoredCycleTimes: number[] = pullRequests
    .filter((pull) => pull.state === 'MERGED')
    .map((pull) => pull.cycleTime as number);

  const reviewResponseTimes: number[] = reviewedPullRequests
    .filter((pull) => pull.state === 'MERGED')
    .map((pull) => pull.daysToFirstReview as number);

  const reviewDurations: number[] = reviewedPullRequests
    .filter((pull) => pull.state === 'MERGED')
    .map((pull) => pull.reworkTimeInDays as number);

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
      <TileContainer container columnSpacing={2} rowSpacing={1}>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Authored Pull Requests', pullRequests.length, 
            'Total pull requests that this user has authored'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Open Pull Requests', openPullRequests,
            'Total pull requests that this user currently has open'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Merged Pull Requests', mergedPullRequests, 
            'Total pull requests that this user opened and later merged'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Closed Pull Requests', closedPullRequests,
            'Total pull requests that this user opened and later closed'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Median Cycle Time',
            authoredCycleTimes.length > 0 ? getMedian(authoredCycleTimes) : '-',
            'Median business days between the first commit and deployment/merge'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Average Cycle Time',
            authoredCycleTimes.length > 0
              ? Math.round(getAverage(authoredCycleTimes) * 100) / 100
              : '-',
            'Average business days between the first commit and deployment/merge'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Average Review Response',
            reviewResponseTimes.length > 0
              ? getAverage(reviewResponseTimes)
              : '-',
            'Average business days between opening the PR and first review'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Average Review Duration',
            reviewDurations.length > 0 ? getAverage(reviewDurations) : '-',
            'Average business days between first and last review of a Pull Request'
          )}
        </Grid>
      </TileContainer>
    </Box>
  );
}

export default MetricTiles;
