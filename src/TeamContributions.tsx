import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TeamContributionsRadarChart from './TeamContributionRadarChart';
import Box from '@mui/material/Box';
import PullRequestMetricsTable from './PullRequestMetricsTable';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import PullThrouputChart from './PullThroughputChart';
import HighLevelMetrics from './HighLevelMetrics';
import CycleTimeChart from './CycleTimeChart';
import { toWeeklyMetrics } from './cycle-time/toWeeklyMetrics';

import { usePullRequests } from './usePullRequests';

type Props = {
  organization: string;
  teamSlug: string;
  authors: string[];
  startDate: Date;
  endDate: Date;
};

function TeamContributions({
  organization,
  teamSlug,
  authors,
  startDate,
  endDate,
}: Props) {
  const [activeTab, setActiveTab] = useState('table');
  const [toggledAuthors, setToggledAuthors] = useState<string[]>(authors);
  const handleChange = (event: any, newTab: string) => setActiveTab(newTab);

  const { pullRequests, loading } = usePullRequests({
    authors: toggledAuthors,
    from: startDate,
    to: endDate,
  });

  const weeklyMetrics = useMemo(() => {
    if (loading) return [];
    return toWeeklyMetrics(pullRequests, startDate, endDate);
  }, [pullRequests, startDate, endDate, loading]);

  if (loading) return <Box>Loading...</Box>;

  const toggledAuthor = (authorToToggle: string) => () => {
    if (toggledAuthors.includes(authorToToggle)) {
      setToggledAuthors(
        toggledAuthors.filter((author) => author !== authorToToggle)
      );
    } else {
      setToggledAuthors([...toggledAuthors, authorToToggle]);
    }
  };

  return (
    <Accordion>
      <AccordionSummary sx={{ display: 'flex' }}>
        <TeamContributionsRadarChart
          organization={organization}
          teamSlug={teamSlug}
          startDate={startDate}
          endDate={endDate}
          toggledAuthors={toggledAuthors}
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
        <Box>
          <FormGroup sx={{ flexDirection: 'row' }}>
            {authors.map((author) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={toggledAuthors.includes(author)}
                    onChange={toggledAuthor(author)}
                  />
                }
                label={author}
              />
            ))}
          </FormGroup>
        </Box>
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

export default TeamContributions;
