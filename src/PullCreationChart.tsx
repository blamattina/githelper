import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import { Paper } from '@mui/material';
import {
  LineChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { PullRequestKeyMetrics } from './types';
import { addWeeks } from 'date-fns';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
  onMouseMove?: any;
  onMouseLeave?: any;
};

type PullCreationWeekMetaData = {
  week: Date;
  weekString: string;
  additions: number;
  deletions: number;
  pullsCreated: number;
  pullsMerged: number;
};

function PullCreationChart({
  pullRequests,
  startDate,
  endDate,
  onMouseMove,
  onMouseLeave,
}: Props) {
  const data: PullCreationWeekMetaData[] = [];

  //TODO - this is typed loosely
  let prWeekMap: any = {};

  //Initialize empty weeks
  let currentInitWeek = startOfWeek(startDate);
  const lastWeek = startOfWeek(endDate);
  while (currentInitWeek <= lastWeek) {
    const currentPullWeek = format(currentInitWeek, 'MM-dd-yy');

    //Initialize new week metadata
    let currentWeek: PullCreationWeekMetaData = {
      week: currentInitWeek,
      weekString: currentPullWeek,
      additions: 0,
      deletions: 0,
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
    let currentWeek: PullCreationWeekMetaData = prWeekMap[currentPullWeek];

    //Update objects data
    if (currentWeek) {
      currentWeek.additions += pull.additions;
      currentWeek.deletions += pull.deletions;
      currentWeek.pullsCreated++;

      prWeekMap[currentPullWeek] = currentWeek;
    }

    if (pull.state === 'MERGED' && pull.merged) {
      const mergeWeek = startOfWeek(pull.merged);
      const currentMergeWeek = format(mergeWeek, 'MM-dd-yy');

      //Check if we already have week and should just be adding to it.
      if (currentMergeWeek in prWeekMap) {
        currentWeek = prWeekMap[currentMergeWeek];
        currentWeek.pullsMerged++;
        prWeekMap[currentMergeWeek] = currentWeek;
      }
    }
  });

  for (const key in prWeekMap) {
    const value = prWeekMap[key];
    data.push(value);
  }
  data.sort();

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <ResponsiveContainer height={350}>
        <LineChart
          data={data}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <XAxis dataKey="weekString" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            name="New Pulls"
            type="monotone"
            dataKey="pullsCreated"
            stroke="#ff5c35"
          />
          <Line
            name="Pulls Merged"
            type="monotone"
            dataKey="pullsMerged"
            stroke="#8250df"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PullCreationChart;
