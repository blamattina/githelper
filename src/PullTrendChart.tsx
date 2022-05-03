import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import { Paper } from '@mui/material';
import {
  ResponsiveContainer,
  Scatter,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';
import { PullRequestKeyMetrics } from './types';
import { differenceInWeeks, getTime } from 'date-fns';
import { addWeeks } from 'date-fns';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
};

type PullTrendMetaData = {
  unixTimestamp: number;
  weekString?: string;
  cycleTime?: number;
  linesofCodeChanged?: number;
  pullName?: string;
  pullUrl?: string;
  pullsCreated?: number;
  pullsMerged?: number;
};

const CustomTooltip = ({}) => {
  return <div>test</div>;
};

function PullTrendChart({ pullRequests, startDate, endDate }: Props) {
  const data: PullTrendMetaData[] = [];

  //Calculate Scatter data
  pullRequests.forEach((pull) => {
    if (pull.merged && pull.cycleTime !== undefined) {
      data.push({
        unixTimestamp: getTime(pull.merged),
        cycleTime: pull.cycleTime,
        linesofCodeChanged: pull.additions + pull.deletions,
        pullName: pull.title,
        pullUrl: `https://git.hubteam.com/${pull.repo}/issues/${pull.number}`,
      });
    }
  });

  //Calculate Created/Merged data
  //TODO - this is typed loosely
  let prWeekMap: any = {};

  //Initialize empty weeks
  let currentInitWeek = startOfWeek(startDate);
  const lastWeek = startOfWeek(endDate);
  while (currentInitWeek <= lastWeek) {
    const currentPullWeek = format(currentInitWeek, 'MM-dd-yy');

    //todo
    //Initialize new week metadata
    let currentWeek: PullTrendMetaData = {
      unixTimestamp: getTime(currentInitWeek),
      weekString: currentPullWeek,
      pullsCreated: 0,
      pullsMerged: 0,
    };
    prWeekMap[currentPullWeek] = currentWeek;

    currentInitWeek = addWeeks(currentInitWeek, 1);
  }

  pullRequests.forEach((pull) => {
    const week = startOfWeek(pull.created);
    const currentPullWeek = format(week, 'MM-dd-yy');

    //Initialize new week metadata
    let currentWeek: PullTrendMetaData = prWeekMap[currentPullWeek];

    //Update objects data
    if (currentWeek && currentWeek.pullsCreated !== undefined) {
      currentWeek.pullsCreated++;

      prWeekMap[currentPullWeek] = currentWeek;
    }

    if (pull.state === 'MERGED' && pull.merged) {
      const mergeWeek = startOfWeek(pull.merged);
      const currentMergeWeek = format(mergeWeek, 'MM-dd-yy');

      //Check if we already have week and should just be adding to it.
      if (currentMergeWeek in prWeekMap) {
        currentWeek = prWeekMap[currentMergeWeek];
        if (currentWeek.pullsMerged !== undefined) {
          currentWeek.pullsMerged++;
          prWeekMap[currentMergeWeek] = currentWeek;
        }
      }
    }
  });

  for (const key in prWeekMap) {
    const value = prWeekMap[key];
    data.push(value);
  }
  data.sort();

  console.log(data);

  //Calculate minumum ticks
  let tickCount = differenceInWeeks(endDate, startDate) + 5;
  if (tickCount < 7) {
    tickCount = 7;
  }

  return (
    <Paper elevation={0} sx={{ height: '350px' }}>
      <ResponsiveContainer>
        <ComposedChart data={data}>
          <Legend />
          <Tooltip
            formatter={(value: any, name: any, props: any) => {
              if (name === 'Deployment Date') {
                return format(new Date(value), 'MM-dd-yyyy hh:mm bb');
              }
              return value;
            }}
          />
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
            yAxisId="cycle-axis"
          />
          <YAxis
            allowDecimals={false}
            name="Number of Pulls"
            yAxisId="pulls-axis"
            orientation="right"
          />
          <ZAxis
            type="number"
            dataKey="linesofCodeChanged"
            range={[10, 300]}
            name="Lines of Code Changed"
          />
          <Scatter
            fill="#003f5c"
            yAxisId="cycle-axis"
            onClick={(props) => {
              window.open(props.pullUrl, '_blank');
            }}
          />
          <Line
            name="New Pulls"
            type="monotone"
            dataKey="pullsCreated"
            stroke="#bc5090"
            yAxisId="pulls-axis"
          />
          <Line
            type="monotone"
            name="Merged Pulls"
            dataKey="pullsMerged"
            stroke="#ffa600"
            yAxisId="pulls-axis"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PullTrendChart;
