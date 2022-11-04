import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { usePullRequests } from './usePullRequests';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Tab,
} from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import type { OrganizationOption, TeamOption } from './GitOrgActivityPage';
import { AuthorOption } from './GitUserActivityPage';
import CycleTimeScatterPlot from './CycleTimeScatterPlot';
import PullCreationChart from './PullCreationChart';
import LanguagePieChart from './LanguagePieChart';
import UserPullPieChart from './UserPullPieChart';
import MetricTiles from './MetricTiles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PullRequestTable from './pull-request-table/PullRequestTable';

type Props = {
  organization: OrganizationOption;
  team: TeamOption;
  members: AuthorOption[];
  startDate: Date;
  endDate: Date;
};

function TeamContributions({ members, startDate, endDate }: Props) {
  const [activeTab, setActiveTab] = useState('authored');
  const [pullStartWeekHighlighted, setPullStartWeekHighlighted] =
    useState(null);

  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);

  const authors = useMemo(() => {
    let authorsArr: string[] = [];
    members.forEach((member: AuthorOption) => {
      if (member?.login) {
        authorsArr.push(member.login);
      }
    });
    return authorsArr;
  }, [members]);

  const { pullRequests: authoredPullRequests, loading: authoredPullsLoading } =
    usePullRequests({
      authors,
      from: startDate,
      to: endDate,
    });

  const { pullRequests: reviewedPullRequests, loading: reviewedPullsLoading } =
    usePullRequests({
      reviewedBy: authors,
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

export default TeamContributions;
