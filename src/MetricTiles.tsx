import { Box, Grid, Paper } from '@mui/material';
import { PullRequestKeyMetrics } from './types';
import { styled } from '@mui/material';

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
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

const getHighest = (arr: number[]) => {
  return arr.reduce(function (a, b) {
    return Math.max(a, b);
  }, -Infinity);
};

const renderTileValue = (title: string, value: any) => {
  return (
    <Tile elevation={0}>
      <div>{title}</div>
      <MetricValue>{value}</MetricValue>
    </Tile>
  );
};

function MetricTiles({ pullRequests, reviewedPullRequests }: Props) {
  const authoredCycleTimes: number[] = pullRequests.filter(pull => pull.state === "MERGED").map(pull => pull.cycleTime as number);
  const reviewResponseTimes: number[] = reviewedPullRequests.filter(pull => pull.state === "MERGED").map(pull => pull.daysToFirstReview as number);
  const reviewDurations: number[] = reviewedPullRequests.filter(pull => pull.state === "MERGED").map(pull => pull.reworkTimeInDays as number);
  const openPullRequests = pullRequests.reduce((count, pull) => pull.state === "OPEN" ? count++ : count, 0);
  const mergedPullRequests = pullRequests.reduce((count, pull) => pull.state === "MERGED" ? count++ : count, 0);

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <TileContainer container columnSpacing={2} rowSpacing={1}>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Total Pull Requests', pullRequests.length)}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Open Pull Requests', openPullRequests)}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue('Merged Pull Requests', mergedPullRequests)}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Median Cycle Time',
            authoredCycleTimes.length > 0 ? getMedian(authoredCycleTimes) : '-'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Average Cycle Time',
            authoredCycleTimes.length > 0
              ? Math.round(getAverage(authoredCycleTimes) * 100) / 100
              : '-'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Highest Cycle Time',
            authoredCycleTimes.length > 0 ? getHighest(authoredCycleTimes) : '-'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Average Review Response',
            reviewResponseTimes.length > 0 ? getAverage(reviewResponseTimes) : '-'
          )}
        </Grid>
        <Grid item xs={2} sm={3} md={3}>
          {renderTileValue(
            'Average Review Duration',
            reviewDurations.length > 0 ? getAverage(reviewDurations) : '-'
          )}
        </Grid>
      </TileContainer>
    </Box>
  );
}

export default MetricTiles;
