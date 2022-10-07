import { useMemo } from 'react';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { addWeeks } from 'date-fns';
import { Paper, Typography } from '@mui/material';
import {
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  Label,
} from 'recharts';
import { PullRequestKeyMetrics } from './types';
import { differenceInWeeks, getTime } from 'date-fns';
import { useGitHubBaseUri } from './useGithubUri';
import { getPercentile } from './stats/getPercentile';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
  startDate: Date;
  endDate: Date;
  startWeekStringToHighlight?: string | null;
};

type CycleTimePullMetaData = {
  unixTimestamp: number;
  cycleTime: number;
  linesofCodeChanged: number;
  pullName: string;
  pullUrl: string;
};

type CycleTimeCalculatedMetrics = {
  metadata: CycleTimePullMetaData[];
  cycleTimes: number[];
};

function calculateCycleTimeScatterPlotData(
  pullRequests: PullRequestKeyMetrics[],
  gitHubBaseUri: string
): CycleTimeCalculatedMetrics {
  const metadata: CycleTimePullMetaData[] = [];
  const cycleTimes: number[] = [];

  pullRequests.forEach((pull) => {
    if (pull.merged && pull.cycleTime !== undefined) {
      metadata.push({
        unixTimestamp: getTime(pull.merged),
        cycleTime: pull.cycleTime,
        linesofCodeChanged: pull.additions + pull.deletions,
        pullName: pull.title,
        pullUrl: `${gitHubBaseUri}/${pull.repo}/issues/${pull.number}`,
      });
      cycleTimes.push(pull.cycleTime);
    }
  });

  return {
    metadata,
    cycleTimes,
  };
}

function CycleTimeScatterPlot({
  pullRequests,
  startDate,
  endDate,
  startWeekStringToHighlight,
}: Props) {
  const gitHubBaseUri = useGitHubBaseUri();
  const calculatedData = useMemo(
    () => calculateCycleTimeScatterPlotData(pullRequests, gitHubBaseUri),
    [pullRequests, gitHubBaseUri]
  );

  let tickCount = differenceInWeeks(endDate, startDate);
  if (tickCount < 7) {
    tickCount = 7;
  }

  return (
    <Paper elevation={0} sx={{ height: '100%' }}>
      <Typography align="center" variant="body2" sx={{ paddingTop: 1 }}>
        Cycle Time
      </Typography>
      <ResponsiveContainer height={300}>
        <ScatterChart margin={{ top: 20, left: 0, right: 60, bottom: 20 }}>
          <XAxis
            dataKey="unixTimestamp"
            type="number"
            name="Deployment Date"
            tickCount={tickCount}
            domain={[getTime(startDate), getTime(endDate)]}
            tickFormatter={(unixTimestamp) =>
              format(new Date(unixTimestamp), 'MMM dd')
            }
            tickMargin={15}
            interval="preserveStartEnd"
          />
          <YAxis
            allowDecimals={false}
            dataKey="cycleTime"
            name="Cycle Time"
            type="number"
            unit=" days"
            width={100}
            tickMargin={10}
            scale="sqrt"
          />
          <ZAxis
            type="number"
            dataKey="linesofCodeChanged"
            range={[40, 400]}
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
          {calculatedData.cycleTimes.length >= 10 && (
            <ReferenceLine
              y={getPercentile(calculatedData.cycleTimes, 75)}
              stroke="#ffa600"
              strokeDasharray="3 3"
            >
              <Label value="p75" position="right" />
            </ReferenceLine>
          )}
          {calculatedData.cycleTimes.length >= 10 && (
            <ReferenceLine
              y={getPercentile(calculatedData.cycleTimes, 90)}
              stroke="#ffa600"
              strokeDasharray="3 3"
            >
              <Label value="p90" position="right" />
            </ReferenceLine>
          )}
          <Scatter
            data={calculatedData.metadata}
            onClick={(props) => {
              window.open(props.pullUrl, '_blank');
            }}
            style={{ cursor: 'pointer' }}
          >
            {calculatedData.metadata.map((entry, index) => {
              let fillValue = '#58508d';
              if (startWeekStringToHighlight) {
                const startDate = parse(
                  startWeekStringToHighlight,
                  'MM-dd-yy',
                  new Date()
                );

                if (
                  new Date(entry.unixTimestamp) > startDate &&
                  new Date(entry.unixTimestamp) < addWeeks(startDate, 1)
                ) {
                  fillValue = '#bc5090';
                }
              }

              return <Cell key={`cell-${index}`} fill={fillValue} />;
            })}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default CycleTimeScatterPlot;
