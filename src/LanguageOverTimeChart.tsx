import { useMemo } from 'react';
import format from 'date-fns/format';
import startOfWeek from 'date-fns/startOfWeek';
import { Paper, Typography } from '@mui/material';
import {
  AreaChart,
  Legend,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { LanguageType, PullRequestKeyMetrics } from './types';
import { addWeeks } from 'date-fns';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
};

type LanguageDictionary<T> = {
  [key in LanguageType]?: T;
};

type LanguageWeekMetaData = {
  week: Date;
  weekString: string;
  languages: LanguageDictionary<number>;
};

const COLORS = [
  '#e60049',
  '#0bb4ff',
  '#50e991',
  '#e6d800',
  '#9b19f5',
  '#ffa300',
  '#dc0ab4',
  '#b3d4ff',
  '#00bfa0',
];

function calculateLanguageOverTimeChartData(
  pullRequests: PullRequestKeyMetrics[],
  startDate: Date,
  endDate: Date
): LanguageWeekMetaData[] {
  const data: LanguageWeekMetaData[] = [];

  //TODO - this is typed loosely
  let prWeekMap: any = {};
  let languageCountMap: any = {};

  //Initialize empty weeks
  let currentInitWeek = startOfWeek(startDate);
  const lastWeek = startOfWeek(endDate);
  while (currentInitWeek <= lastWeek) {
    const currentPullWeek = format(currentInitWeek, 'MM-dd-yy');

    //Initialize new week metadata
    let currentWeek: LanguageWeekMetaData = {
      week: currentInitWeek,
      weekString: currentPullWeek,
      languages: {},
    };
    prWeekMap[currentPullWeek] = currentWeek;

    currentInitWeek = addWeeks(currentInitWeek, 1);
  }

  pullRequests.forEach((pull) => {
    const week = startOfWeek(pull.created);
    const currentPullWeek = format(week, 'MM-dd-yy');

    //Initialize new week metadata
    let currentWeek: LanguageWeekMetaData = prWeekMap[currentPullWeek];

    //Update objects data
    if (currentWeek && pull.languages?.primaryLanguageType) {
      if (currentWeek.languages[pull.languages.primaryLanguageType]) {
        let currentLanguageCount =
          currentWeek.languages[pull.languages.primaryLanguageType];

        if (!currentLanguageCount) currentLanguageCount = 0;

        currentWeek.languages[pull.languages.primaryLanguageType] =
          currentLanguageCount + 1;
      } else {
        currentWeek.languages[pull.languages.primaryLanguageType] = 1;
      }

      if (languageCountMap[pull.languages.primaryLanguageType]) {
        languageCountMap[pull.languages.primaryLanguageType]++;
      } else {
        languageCountMap[pull.languages.primaryLanguageType] = 1;
      }

      prWeekMap[currentPullWeek] = currentWeek;
    }
  });

  for (const key in languageCountMap) {
    if (languageCountMap[key] / pullRequests.length < 0.03) {
      delete languageCountMap[key];
    }
  }

  for (const key in prWeekMap) {
    const value = prWeekMap[key];
    for (const key in value.languages) {
      if (!languageCountMap[key]) {
        delete value.languages[key];
      }
    }

    for (const key in languageCountMap) {
      if (!value.languages[key]) {
        value.languages[key] = 0;
      }
    }

    data.push(value);
  }
  data.sort();

  return data;
}

function getAreas(data: LanguageWeekMetaData[]): any[] {
  const keysArr = Object.keys(data[0].languages).slice();
  let colorCounter = 0;

  const lineArr: any[] = [];
  keysArr.forEach((item, index) => {
    lineArr.push(
      <Area
        type="monotone"
        key={index}
        stackId="1"
        dataKey={`languages.${item}`}
        stroke={COLORS[colorCounter]}
        fill={COLORS[colorCounter]}
      />
    );
    colorCounter++;
    if (colorCounter > COLORS.length - 1) {
      colorCounter = 0;
    }
  });
  return lineArr;
}

function LanguageOverTimeChart({ pullRequests, startDate, endDate }: Props) {
  const data: LanguageWeekMetaData[] = useMemo(
    () => calculateLanguageOverTimeChartData(pullRequests, startDate, endDate),
    [pullRequests, startDate, endDate]
  );

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <Typography align="center" variant="body2" sx={{ paddingTop: 1 }}>
        Pull Requests
      </Typography>
      <ResponsiveContainer height={350}>
        <AreaChart
          data={data}
          margin={{ top: 20, left: 0, right: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="weekString"
            scale="band"
            tickFormatter={(unixTimestamp) =>
              format(new Date(unixTimestamp), 'MMM dd')
            }
          />
          <YAxis width={50} />
          <Tooltip />
          <Legend />
          {getAreas(data)}
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default LanguageOverTimeChart;
