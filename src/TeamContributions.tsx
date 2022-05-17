import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import PullRequestMetricsTable from './pull-request-metrics-table/PullRequestMetricsTable';
import { usePullRequests } from './usePullRequests';
import { LinearProgress, Tab } from '@mui/material';
import { TabContext, TabPanel, TabList } from '@mui/lab';
import type { OrganizationOption, TeamOption } from './GitOrgActivityPage';
import { AuthorOption } from './GitUserActivityPage';
import CycleTimeScatterPlot from './CycleTimeScatterPlot';
import PullCreationChart from './PullCreationChart';
import MetricTiles from './MetricTiles';
import LanguagePieChart from './LanguagePieChart';
import UserPullPieChart from './UserPullPieChart';

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
        <Grid item xs={2}>
          <UserPullPieChart authoredPullRequests={authoredPullRequests} />
        </Grid>
        <Grid item xs={2}>
          <LanguagePieChart authoredPullRequests={authoredPullRequests} />
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

export default TeamContributions;
