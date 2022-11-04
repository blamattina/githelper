import { useState, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import ContributionsRadarChart from './ContributionsRadarChart';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { usePullRequests } from './usePullRequests';
import CycleTimeScatterPlot from './CycleTimeScatterPlot';
import MetricTiles from './MetricTiles';
import { LinearProgress } from '@mui/material';
import PullCreationChart from './PullCreationChart';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PullRequestTable from './pull-request-table/PullRequestTable';

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

  if (authoredPullsLoading || reviewedPullsLoading)
    return (
      <Box sx={{ paddingTop: 20 }}>
        <LinearProgress color="success" />
      </Box>
    );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <MetricTiles
            pullRequests={authoredPullRequests}
            reviewedPullRequests={reviewedPullRequests}
          />
        </Grid>
        <Grid item xs={12}>
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <ShowChartIcon /> Charts
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <ContributionsRadarChart
                    author={login}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </Grid>
                <Grid item xs={3}>
                  <PullCreationChart
                    pullRequests={authoredPullRequests}
                    reviewedPullRequests={reviewedPullRequests}
                    startDate={startDate}
                    endDate={endDate}
                    pullStartWeekHighlighted={pullStartWeekHighlighted}
                    setPullStartWeekHighlighted={setPullStartWeekHighlighted}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CycleTimeScatterPlot
                    pullRequests={authoredPullRequests}
                    startDate={startDate}
                    endDate={endDate}
                    startWeekStringToHighlight={pullStartWeekHighlighted}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ padding: 1, overflow: 'scroll' }}>
            <TabContext value={activeTab}>
              <TabList onChange={handleChange} centered>
                <Tab label="Authored Pull Requests" value="authored" />
                <Tab label="Reviewed Pull Requests" value="reviewed" />
              </TabList>
              <TabPanel value="authored">
                <PullRequestTable pullRequests={authoredPullRequests} />
              </TabPanel>
              <TabPanel value="reviewed">
                <PullRequestTable pullRequests={reviewedPullRequests} />
              </TabPanel>
            </TabContext>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Contributions;
