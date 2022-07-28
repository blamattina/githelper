import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import PullRequestMetricsTable from './pull-request-metrics-table/PullRequestMetricsTable';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { usePullRequests } from './usePullRequests';
import CycleTimeScatterPlot from './CycleTimeScatterPlot';
import MetricTiles from './MetricTiles';
import { LinearProgress } from '@mui/material';
import PullCreationChart from './PullCreationChart';
import LanguagePieChart from './LanguagePieChart';

type Props = {
  login: string;
  name: string;
  startDate: Date;
  endDate: Date;
};

function RepoContributions({ login, name, startDate, endDate }: Props) {
  const [activeTab, setActiveTab] = useState('authored');
  const [pullStartWeekHighlighted, setPullStartWeekHighlighted] =
    useState(null);
  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);

  const { pullRequests: authoredPullRequests, loading: authoredPullsLoading } =
    usePullRequests({
      from: startDate,
      to: endDate,
      repository: `${login}/${name}`,
    });

  const { pullRequests: reviewedPullRequests, loading: reviewedPullsLoading } =
    usePullRequests({
      from: startDate,
      to: endDate,
      repository: `${login}/${name}`,
    });

  if (authoredPullsLoading || reviewedPullsLoading)
    return (
      <Box sx={{ paddingTop: 20 }}>
        <LinearProgress color="success" />
      </Box>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <LanguagePieChart authoredPullRequests={authoredPullRequests} />
        </Grid>
        <Grid item xs={9}>
          <MetricTiles
            pullRequests={authoredPullRequests}
            reviewedPullRequests={reviewedPullRequests}
          />
        </Grid>
        <Grid item xs={4}>
          <PullCreationChart
            pullRequests={authoredPullRequests}
            reviewedPullRequests={reviewedPullRequests}
            startDate={startDate}
            endDate={endDate}
            pullStartWeekHighlighted={pullStartWeekHighlighted}
            setPullStartWeekHighlighted={setPullStartWeekHighlighted}
          />
        </Grid>
        <Grid item xs={8}>
          <CycleTimeScatterPlot
            pullRequests={authoredPullRequests}
            startDate={startDate}
            endDate={endDate}
            startWeekStringToHighlight={pullStartWeekHighlighted}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: 1 }}>
            <TabContext value={activeTab}>
              <TabList onChange={handleChange} centered>
                <Tab label="Authored Pull Requests" value="authored" />
                <Tab label="Reviewed Pull Requests" value="reviewed" />
              </TabList>
              <TabPanel value="authored">
                <PullRequestMetricsTable pullRequests={authoredPullRequests} />
              </TabPanel>
              <TabPanel value="reviewed">
                <PullRequestMetricsTable pullRequests={reviewedPullRequests} />
              </TabPanel>
            </TabContext>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RepoContributions;
