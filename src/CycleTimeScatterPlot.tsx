import format from 'date-fns/format';
import parse from 'date-fns/parse';
import { addWeeks } from 'date-fns';
import { Paper } from '@mui/material';
import {
  Cell,
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
import { useGitHubBaseUri } from './useGithubUri';

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

function CycleTimeScatterPlot({
  pullRequests,
  startDate,
  endDate,
  startWeekStringToHighlight,
}: Props) {
  const data: CycleTimePullMetaData[] = [];
  const gitHubBaseUri = useGitHubBaseUri();

  pullRequests.forEach((pull) => {
    if (pull.merged && pull.cycleTime !== undefined) {
      data.push({
        unixTimestamp: getTime(pull.merged),
        cycleTime: pull.cycleTime,
        linesofCodeChanged: pull.additions + pull.deletions,
        pullName: pull.title,
        pullUrl: `${gitHubBaseUri}/${pull.repo}/issues/${pull.number}`,
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
        <ScatterChart margin={{ top: 20, left: 0, right: 50, bottom: 20 }}>
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
            width={50}
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
          <Scatter
            data={data}
            onClick={(props) => {
              window.open(props.pullUrl, '_blank');
            }}
          >
            {data.map((entry, index) => {
              let fillValue = '#8884d8';
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
                  fillValue = '0f0e2c';
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
