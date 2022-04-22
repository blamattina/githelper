import {
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ResponsiveContainer
} from 'recharts';
import Paper from '@mui/material/Paper';

type Props = {
  weeklyMetrics: any;
};

function PullThroughputChart({ weeklyMetrics }: Props) {
  return (
    <Paper elevation={0} sx={{ height: '100%', padding: 1 }}>
      <ResponsiveContainer height="100%">
        <AreaChart
          data={weeklyMetrics}
          syncId="PR"
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="wip"
            stroke="orange"
            fillOpacity={0.05}
            stackId="wip"
            fill="orange"
          />
          <Area
            type="monotone"
            dataKey="created"
            stroke="blue"
            fillOpacity={0.05}
            stackId="wip"
            fill="blue"
          />
          <Area
            type="monotone"
            dataKey="merged"
            stroke="green"
            fillOpacity={0.05}
            stackId="wip"
            fill="green"
          />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default PullThroughputChart;
