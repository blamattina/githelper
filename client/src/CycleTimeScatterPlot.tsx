import format from 'date-fns/format';
import { Paper } from '@mui/material';
import {
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
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
  linesofCodeChanged: number;
  pullName: string;
};

function CycleTimeScatterPlot({ pullRequests, startDate, endDate }: Props) {
  const data: CycleTimePullMetaData[] = [];

  pullRequests.forEach((pull) => {
    if (pull.merged && pull.cycleTime !== undefined) {
      data.push({
        unixTimestamp: getTime(pull.merged),
        cycleTime: pull.cycleTime,
        linesofCodeChanged: pull.additions + pull.deletions,
        pullName: pull.title,
      });
    }
  });

  let tickCount = differenceInWeeks(endDate, startDate);
  if (tickCount < 7) {
    tickCount = 7;
  }

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={350}>
        <ScatterChart>
          <XAxis
            dataKey="unixTimestamp"
            type="number"
            name="Deployment Date"
            tickCount={tickCount}
            domain={[getTime(startDate), getTime(endDate)]}
            tickFormatter={(unixTimestamp) =>
              format(new Date(unixTimestamp), 'MM-dd-yyyy')
            }
          />
          <YAxis
            dataKey="cycleTime"
            allowDecimals={false}
            name="Cycle Time (business days)"
          />
          <ZAxis
            type="number"
            dataKey="linesofCodeChanged"
            range={[20, 300]}
            name="Lines of Code Changed"
          />
          <Tooltip
            formatter={(value: any, name: any, props: any) => {
              if (name === 'Deployment Date') {
                return format(new Date(value), 'MM-dd-yyyy hh:mm bb');
              }
              return value;
            }}
          />
          <Scatter data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default CycleTimeScatterPlot;
