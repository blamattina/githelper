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
  Line,
  LineChart,
} from 'recharts';
import { toWeeklyMetrics } from './cycle-time/toWeeklyMetrics';
import Box from '@mui/material/Box';
import HighLevelMetrics from './HighLevelMetrics';

type Props = {
  weeklyMetrics: any;
  metricName: string;
  color: string;
};

function CycleTimeChart({ weeklyMetrics, metricName, color }: Props) {
  return (
    <LineChart
      width={300}
      height={200}
      data={weeklyMetrics}
      syncId="PR"
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip formatter={(value) => value.toFixed(2)} />
      <Line type="monotone" dataKey={metricName} stroke={color} />
      <Legend />
    </LineChart>
  );
}

export default CycleTimeChart;
