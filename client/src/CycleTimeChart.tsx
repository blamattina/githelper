import React, { useMemo } from 'react';
import format from 'date-fns/format';
import endOfWeek from 'date-fns/endOfWeek';
import addWeeks from 'date-fns/addWeeks';
import {
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from 'recharts';
import { toWeeklyMetrics } from './cycle-time/toWeeklyMetrics';
import Box from '@mui/material/Box';
import HighLevelMetrics from './HighLevelMetrics';

type Props = {
  metrics: any;
};

function CycleTimeChart({ metrics }: Props) {
  return (
    <AreaChart
      width={500}
      height={400}
      data={metrics}
      syncId="PR"
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip formatter={(value) => value.toFixed(2)} />
      <Area
        type="monotone"
        dataKey="daysToFirstReview"
        stackId="cycle"
        fillOpacity={0.6}
        stroke="blue"
        fill="blue"
      />
      <Area
        type="monotone"
        dataKey="commitToPullRequest"
        stackId="cycle"
        fillOpacity={0.6}
        stroke="green"
        fill="green"
      />
      <Area
        type="monotone"
        dataKey="reworkTimeInDays"
        stackId="cycle"
        fillOpacity={0.6}
        stroke="orange"
        fill="orange"
      />
      <Area
        type="monotone"
        dataKey="waitingToDeploy"
        stackId="cycle"
        fillOpacity={0.6}
        stroke="red"
        fill="red"
      />
      <Legend />
    </AreaChart>
  );
}

export default CycleTimeChart;
