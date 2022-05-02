import { useState } from 'react';
import Grid from '@mui/material/Grid';
import ContributionsRadarChart from './ContributionsRadarChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import PullRequestMetricsTable from './PullRequestMetricsTable';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { usePullRequests } from './usePullRequests';
import CycleTimeScatterPlot from './CycleTimeScatterPlot';
import MetricTiles from './MetricTiles';
import { LinearProgress } from '@mui/material';
import PullCreationChart from './PullCreationChart';

type Props = {
  login: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

function Contributions({ login, name, startDate, endDate }: Props) {
  const [activeTab, setActiveTab] = useState('authored');
  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);

  const { pullRequests, loading } = usePullRequests({
    author: login,
    from: startDate,
    to: endDate,
  });

  if (loading)
    return (
      <Box sx={{ paddingTop: 20 }}>
        <LinearProgress color="success" />
      </Box>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ContributionsRadarChart
            author={login}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid item xs={8}>
          <MetricTiles pullRequests={pullRequests} />
        </Grid>
        <Grid item xs={6}>
          <PullCreationChart
            pullRequests={pullRequests}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid item xs={6}>
          <CycleTimeScatterPlot
            pullRequests={pullRequests}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: 1 }}>
            <TabContext value={activeTab}>
              <TabList onChange={handleChange} centered>
                <Tab label="Authored Pull Requests" value="authored" />
                <Tab label="Reviewed Pull Requests" value="reviewed" disabled />
              </TabList>
              <TabPanel value="authored">
                <PullRequestMetricsTable pullRequests={pullRequests} />
              </TabPanel>
            </TabContext>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Contributions;
