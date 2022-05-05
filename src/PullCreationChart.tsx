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
  reviewedPullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
};

type PullCreationWeekMetaData = {
  week: Date;
  weekString: string;
  pullsCreated: number;
  pullsMerged: number;
  pullsReviewed: number;
};

function PullCreationChart({
  pullRequests,
  reviewedPullRequests,
  startDate,
  endDate,
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
      pullsCreated: 0,
      pullsMerged: 0,
      pullsReviewed: 0,
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

  //Reviewed pull requests
  reviewedPullRequests.forEach((pull) => {
    const week = startOfWeek(pull.created);
    const currentPullWeek = format(week, 'MM-dd-yy');

    let currentWeek: PullCreationWeekMetaData = prWeekMap[currentPullWeek];
    if (currentWeek) {
      currentWeek.pullsReviewed++;
      prWeekMap[currentPullWeek] = currentWeek;
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
        <LineChart data={data}>
          <XAxis dataKey="weekString" scale="band" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            name="New Pulls"
            type="monotone"
            dataKey="pullsCreated"
            stroke="#ea5545"
          />
          <Line
            name="Pulls Merged"
            type="monotone"
            dataKey="pullsMerged"
            stroke="#b33dc6"
          />
          <Line
            name="Pulls Reviewed"
            type="monotone"
            dataKey="pullsReviewed"
            stroke="#27aeef"
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PullCreationChart;
