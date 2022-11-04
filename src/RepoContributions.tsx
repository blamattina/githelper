import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { usePullRequests } from './usePullRequests';
import CycleTimeScatterPlot from './CycleTimeScatterPlot';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
} from '@mui/material';
import PullCreationChart from './PullCreationChart';
import LanguagePieChart from './LanguagePieChart';
import MetricTiles from './MetricTiles';
import UserPullPieChart from './UserPullPieChart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PullRequestTable from './pull-request-table/PullRequestTable';

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
                <Grid item xs={2}>
                  <UserPullPieChart
                    authoredPullRequests={authoredPullRequests}
                  />
                </Grid>
                <Grid item xs={2}>
                  <LanguagePieChart
                    authoredPullRequests={authoredPullRequests}
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
                <Grid item xs={5}>
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

export default RepoContributions;
