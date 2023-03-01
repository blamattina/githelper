import { Box, Grid, Paper } from '@mui/material';
import { PullRequestKeyMetrics } from './types';
import { styled } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { merge } from 'lodash';
import { getMedian } from './utils';
import { differenceInCalendarDays } from 'date-fns';

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

const formatWithPercentage = (n: number, d: number): string =>
  `Pull Requests (${((n / d) * 100).toFixed(0)}%)`;

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
  const commitToMergeLeadTimes: number[] = pullRequests
    .filter((pull) => pull.state === 'MERGED' && pull.commitLeadTimes.length)
    .map((pull) => pull.commitLeadTimes)
    .flat()
    .sort((a, b) => a - b);

  const openPullRequests = pullRequests.filter(
    (pull) => pull.state === 'OPEN'
  ).length;

  const mergedPullRequests = pullRequests.filter(
    (pull) => pull.state === 'MERGED'
  ).length;

  const closedPullRequests = pullRequests.filter(
    (pull) => pull.state === 'CLOSED'
  ).length;

  const revertPullRequests = pullRequests.filter((pull) => pull.revert).length;

  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <TileContainer container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Total',
            pullRequests.length,
            'Total pull requests that this user has authored',
            'Pull Requests'
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Open',
            openPullRequests,
            'Total pull requests that this user currently has open',
            formatWithPercentage(openPullRequests, pullRequests.length)
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Merged',
            mergedPullRequests,
            'Total pull requests that this user opened and later merged',
            formatWithPercentage(mergedPullRequests, pullRequests.length)
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Closed',
            closedPullRequests,
            'Total pull requests that this user opened and later closed',
            formatWithPercentage(closedPullRequests, pullRequests.length)
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Reverts',
            revertPullRequests,
            'Total pull requests that likely contain a revert',
            formatWithPercentage(revertPullRequests, pullRequests.length)
          )}
        </Grid>
        <Grid item xs={2} sm={2} md={2}>
          {renderTileValue(
            'Commit to Merge',
            commitToMergeLeadTimes.length > 0
              ? getMedian(commitToMergeLeadTimes)
              : '-',
            'Median days it takes a commit to be merged',
            'Days (median)'
          )}
        </Grid>
      </TileContainer>
    </Box>
  );
}

export default MetricTiles;
