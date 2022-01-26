import React, { useState, useMemo } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
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
import { toWeeklyMetrics } from './cycle-time/toWeeklyMetrics';

import { usePullRequests } from './usePullRequests';

type Props = {
  authors: string[];
  startDate: Date;
  endDate: Date;
};

function Contributions({ authors, startDate, endDate }: Props) {
  const [activeTab, setActiveTab] = useState('table');
  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);

  const { pullRequests, loading } = usePullRequests({
    authors,
    from: startDate,
    to: endDate,
  });
  const weeklyMetrics = useMemo(() => {
    if (loading) return [];
    return toWeeklyMetrics(pullRequests, startDate, endDate);
  }, [pullRequests, startDate, endDate, loading]);

  if (loading) return <Box>Loading...</Box>;

  return (
    <Accordion>
      <AccordionSummary sx={{ display: 'flex' }}>
        <ContributionsRadarChart
          author={authors[0]}
          startDate={startDate}
          endDate={endDate}
        />
        <Box>
          <PullThrouputChart weeklyMetrics={weeklyMetrics} />
          <HighLevelMetrics
            pullRequests={pullRequests}
            startDate={startDate}
            endDate={endDate}
          />
        </Box>
        <Box>
          <CycleTimeChart
            weeklyMetrics={weeklyMetrics}
            metricName="commitToPullRequest"
            color="blue"
          />
          <CycleTimeChart
            weeklyMetrics={weeklyMetrics}
            metricName="daysToFirstReview"
            color="green"
          />
        </Box>
        <Box>
          <CycleTimeChart
            weeklyMetrics={weeklyMetrics}
            metricName="reworkTimeInDays"
            color="orange"
          />
          <CycleTimeChart
            weeklyMetrics={weeklyMetrics}
            metricName="waitingToDeploy"
            color="red"
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <TabContext value={activeTab}>
          <TabList onChange={handleChange}>
            <Tab label="Pull Requests" value="table" />
          </TabList>
          <TabPanel value="table">
            <PullRequestMetricsTable pullRequests={pullRequests} />
          </TabPanel>
        </TabContext>
      </AccordionDetails>
    </Accordion>
  );
}

export default Contributions;
