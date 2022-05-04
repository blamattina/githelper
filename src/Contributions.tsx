import { useState, useMemo } from 'react';
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
  const [pullStartWeekHighlighted, setPullStartWeekHighlighted] =
    useState(null);
  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);
  const logins = useMemo(() => [login], [login]);

  const { pullRequests: authoredPullRequests, loading: authoredPullsLoading } =
    usePullRequests({
      authors: logins,
      from: startDate,
      to: endDate,
    });

  const { pullRequests: reviewedPullRequests, loading: reviewedPullsLoading } =
    usePullRequests({
      reviewedBy: logins,
      excludeAuthors: logins,
      from: startDate,
      to: endDate,
    });

  const setStartWeekHighlighted = (state: any) => {
    if (state.activeLabel) {
      if (state.activeLabel !== pullStartWeekHighlighted) {
        setPullStartWeekHighlighted(state.activeLabel);
      }
    } else if (pullStartWeekHighlighted !== null) {
      setPullStartWeekHighlighted(null);
    }
  };

  const removeStartWeekHighlighted = () => {
    setPullStartWeekHighlighted(null);
  };

  if (authoredPullsLoading || reviewedPullsLoading)
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
          <MetricTiles
            pullRequests={authoredPullRequests}
            reviewedPullRequests={reviewedPullRequests}
          />
        </Grid>
        <Grid item xs={4}>
          <PullCreationChart
            pullRequests={authoredPullRequests}
            startDate={startDate}
            endDate={endDate}
            onMouseMove={setStartWeekHighlighted}
            onMouseLeave={removeStartWeekHighlighted}
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

export default Contributions;
