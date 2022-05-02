import { Box, Grid, Paper } from '@mui/material';
import { PullRequestKeyMetrics } from './types';
import { styled } from '@mui/material';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
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
    <Tile>
      <div>{title}</div>
      <MetricValue>{value}</MetricValue>
    </Tile>
  );
};

function MetricTiles({ pullRequests }: Props) {
  const cycleTimes: number[] = [];
  let openPullRequests = 0;
  let mergedPullRequests = 0;
  pullRequests.forEach((pull) => {
    if (pull.state === 'OPEN') {
      openPullRequests++;
    } else if (pull.state === 'MERGED') {
      mergedPullRequests++;

      if (pull.cycleTime !== undefined) {
        cycleTimes.push(pull.cycleTime);
      }
    }
  });

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <TileContainer container columnSpacing={2} rowSpacing={1}>
        <Grid item xs={2} sm={4} md={4}>
          {renderTileValue('Total Pull Requests', pullRequests.length)}
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          {renderTileValue('Open Pull Requests', openPullRequests)}
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          {renderTileValue('Merged Pull Requests', mergedPullRequests)}
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          {renderTileValue('Median Cycle Time', getMedian(cycleTimes) || '-')}
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          {renderTileValue(
            'Average Cycle Time',
            cycleTimes.length > 0
              ? Math.round(getAverage(cycleTimes) * 100) / 100
              : '-'
          )}
        </Grid>
        <Grid item xs={2} sm={4} md={4}>
          {renderTileValue(
            'Worst Cycle Time',
            cycleTimes.length > 0 ? getHighest(cycleTimes) : '-'
          )}
        </Grid>
      </TileContainer>
    </Box>
  );
}

export default MetricTiles;
