import React, { useState, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import ContributionsRadarChart from './ContributionsRadarChart';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CycleTimeChart from './CycleTimeChart';
import PullRequestMetricsTable from './PullRequestMetricsTable';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import PullThrouputChart from './PullThroughputChart';
import HighLevelMetrics from './HighLevelMetrics';
import Insights from './Insights';
import { toWeeklyMetrics } from './cycle-time/toWeeklyMetrics';

import { usePullRequests } from './usePullRequests';

type Props = {
  author: string;
  startDate: Date;
  endDate: Date;
};

function Contributions({ author, startDate, endDate }: Props) {
  const [activeTab, setActiveTab] = useState('table');
  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);

  const { pullRequests, loading } = usePullRequests({
    author,
    from: startDate,
    to: endDate,
  });
  const weeklyMetrics = useMemo(() => {
    if (loading) return [];
    return toWeeklyMetrics(pullRequests, startDate, endDate);
  }, [pullRequests, startDate, endDate, loading]);

  if (loading) return <Box>Loading...</Box>;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <ContributionsRadarChart
            author={author}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid item xs={8}>
          <PullThrouputChart weeklyMetrics={weeklyMetrics} />
          <HighLevelMetrics
            pullRequests={pullRequests}
            startDate={startDate}
            endDate={endDate}
          />
        </Grid>
        <Grid item xs={12}>
          <Insights pullRequests={pullRequests} />
        </Grid>
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <TabList onChange={handleChange}>
              <Tab label="Pull Requests" value="table" />
            </TabList>
            <TabPanel value="table">
              <PullRequestMetricsTable pullRequests={pullRequests} />
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Contributions;
