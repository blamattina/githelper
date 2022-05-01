import format from 'date-fns/format';
import { Paper } from '@mui/material';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from 'recharts';
import { PullRequestKeyMetrics } from './types';
import { differenceInWeeks, getTime } from 'date-fns';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
};

type CycleTimePullMetaData = {
  unixTimestamp: number;
  cycleTime: number;
};

function CycleTimeScatterPlot({ pullRequests, startDate, endDate }: Props) {
  const data: CycleTimePullMetaData[] = [];

  pullRequests.forEach((pull) => {
    if (pull.merged && pull.cycleTime !== undefined) {
      data.push({
        unixTimestamp: getTime(pull.merged),
        cycleTime: pull.cycleTime,
      });
    }
  });

  let tickCount = differenceInWeeks(endDate, startDate);
  if (tickCount < 7) {
    tickCount = 7;
  }

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={300}>
        <ScatterChart width={400} height={400}>
          <XAxis
            dataKey="unixTimestamp"
            type="number"
            tickCount={tickCount}
            domain={[getTime(startDate), getTime(endDate)]}
            tickFormatter={(unixTimestamp) =>
              format(new Date(unixTimestamp), 'MM-dd-yyyy')
            }
          />
          <YAxis dataKey="cycleTime" allowDecimals={false} />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default CycleTimeScatterPlot;
