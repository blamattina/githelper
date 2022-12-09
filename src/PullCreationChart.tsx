import { useMemo, useState } from 'react';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import { Paper, Typography } from '@mui/material';
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

enum lineEnum {
  'MERGED',
  'REVIEWED',
  'CREATED',
}

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  reviewedPullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
  pullStartWeekHighlighted?: string | null;
  setPullStartWeekHighlighted: Function | null;
};

type PullCreationWeekMetaData = {
  week: Date;
  weekString: string;
  pullsCreated: number;
  pullsMerged: number;
  pullsReviewed: number;
};

function calculatePullCreationChartData(
  pullRequests: PullRequestKeyMetrics[],
  reviewedPullRequests: PullRequestKeyMetrics[],
  startDate: Date,
  endDate: Date
): PullCreationWeekMetaData[] {
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

  return data;
}

function PullCreationChart({
  pullRequests,
  startDate,
  endDate,
  reviewedPullRequests,
  pullStartWeekHighlighted,
  setPullStartWeekHighlighted,
}: Props) {
  const [disabled, setDisabled] = useState<{
    [key in keyof typeof lineEnum]: boolean;
  }>({
    CREATED: false,
    MERGED: false,
    REVIEWED: false,
  });

  const setLineDisabledValue = (lineName: lineEnum, disabledVal: boolean) => {
    if (lineName === lineEnum.CREATED) {
      setDisabled({ ...disabled, CREATED: disabledVal });
    } else if (lineName === lineEnum.MERGED) {
      setDisabled({ ...disabled, MERGED: disabledVal });
    } else if (lineName === lineEnum.REVIEWED) {
      setDisabled({ ...disabled, REVIEWED: disabledVal });
    }
  };

  const isLineDisabled = (lineName: lineEnum) => {
    if (lineName === lineEnum.CREATED) {
      return disabled.CREATED;
    } else if (lineName === lineEnum.MERGED) {
      return disabled.MERGED;
    } else if (lineName === lineEnum.REVIEWED) {
      return disabled.REVIEWED;
    }

    return false;
  };

  const selectLine = (e: any) => {
    if (e.dataKey === 'pullsCreated') {
      setLineDisabledValue(lineEnum.CREATED, !isLineDisabled(lineEnum.CREATED));
    } else if (e.dataKey === 'pullsMerged') {
      setLineDisabledValue(lineEnum.MERGED, !isLineDisabled(lineEnum.MERGED));
    } else if (e.dataKey === 'pullsReviewed') {
      setLineDisabledValue(
        lineEnum.REVIEWED,
        !isLineDisabled(lineEnum.REVIEWED)
      );
    }
  };

  const data: PullCreationWeekMetaData[] = useMemo(
    () =>
      calculatePullCreationChartData(
        pullRequests,
        reviewedPullRequests,
        startDate,
        endDate
      ),
    [pullRequests, reviewedPullRequests, startDate, endDate]
  );

  const setHighlightedWeek = (state: any) => {
    if (
      setPullStartWeekHighlighted &&
      state &&
      state.activeLabel !== pullStartWeekHighlighted
    ) {
      setPullStartWeekHighlighted(state.activeLabel);
    }
  };

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <Typography align="center" variant="body2" sx={{ paddingTop: 1 }}>
        Pull Requests
      </Typography>
      <ResponsiveContainer height={300}>
        <LineChart
          data={data}
          onMouseMove={setHighlightedWeek}
          onMouseLeave={setHighlightedWeek}
          margin={{ top: 20, left: 0, right: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="week"
            scale="band"
            tickFormatter={(date) => format(date, 'MMM dd')}
          />
          <YAxis width={50} />
          <Tooltip />
          <Legend onClick={selectLine} />

          <Line
            name="New"
            type="monotone"
            dataKey="pullsCreated"
            stroke="#ea5545"
            hide={isLineDisabled(lineEnum.CREATED)}
          />
          <Line
            name="Merged"
            type="monotone"
            dataKey="pullsMerged"
            stroke="#b33dc6"
            hide={isLineDisabled(lineEnum.MERGED)}
          />
          <Line
            name="Reviewed"
            type="monotone"
            dataKey="pullsReviewed"
            stroke="#27aeef"
            hide={isLineDisabled(lineEnum.REVIEWED)}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PullCreationChart;
