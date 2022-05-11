import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import GitOrgChooser from './GitOrgChooser';
import GitTeamChooser from './GitTeamChooser';
import TeamContributionsMembersHoC from './TeamContributionsMembersHoC';
import format from 'date-fns/format';

const LARGE_PR_LIMIT = 5000;

export type OrganizationOption = {
  name: string;
  label: string;
} | null;

export type TeamOption = {
  name: string;
  label: string;
};

function subtractDaysFromDate(d: Date, daystoSubtract: number) {
  d.setDate(d.getDate() - daystoSubtract);
  return d;
}

function GitOrgActivityPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [search, setSearchParams] = useSearchParams();
  const [pullRequestSizeLimit, setPullRequestSizeLimit] =
    useState<number>(LARGE_PR_LIMIT);

  const [org, setOrg] = useState<OrganizationOption | null>(
    (): OrganizationOption | null => {
      if (params.org) {
        return {
          label: params.org || '',
          name: params.org || '',
        };
      }
      return null;
    }
  );

  const [team, setTeam] = useState<TeamOption | null>((): TeamOption | null => {
    if (params.team) {
      return {
        label: params.team || '',
        name: params.team || '',
      };
    }
    return null;
  });

  const [startDate, setStartDate] = useState<Date>(() => {
    const startSearchParam = search.get('start');
    if (startSearchParam) {
      return new Date(startSearchParam);
    }
    return subtractDaysFromDate(new Date(), 90);
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    const endSearchParam = search.get('end');
    if (endSearchParam) {
      return new Date(endSearchParam);
    }
    return new Date();
  });

  //Handle corner case in state when page transitions
  if (org && params.org === undefined) {
    setOrg(null);
    setTeam(null);
    setStartDate(subtractDaysFromDate(new Date(), 90));
    setEndDate(new Date());
  }

  const handleChangeStartDate = useCallback(
    (date: Date | null) => {
      if (!date) return;
      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('start', format(date, 'MM-dd-yyyy'));
      setSearchParams(updatedSearchParams.toString());
      setStartDate(date);
    },
    [setStartDate, search, setSearchParams]
  );

  const handleChangeEndDate = useCallback(
    (date: Date | null) => {
      if (!date) return;

      let updatedSearchParams = new URLSearchParams(search.toString());
      updatedSearchParams.set('end', format(date, 'MM-dd-yyyy'));
      setSearchParams(updatedSearchParams.toString());

      setEndDate(date);
    },
    [setEndDate, search, setSearchParams]
  );

  const handleFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(pullRequestSizeLimit);
      setPullRequestSizeLimit(event.target.checked ? LARGE_PR_LIMIT : Infinity);
    },
    []
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex' }}>
          <GitOrgChooser
            label="Set Organization"
            initialValue={org}
            onChange={(org: OrganizationOption) => {
              if (org && org.name) {
                navigate(`/${params.gitHubHostname}/org/${org.name}`);
              } else {
                navigate(`/${params.gitHubHostname}/org`);
              }

              setOrg(org);
            }}
          />
          {org && (
            <GitTeamChooser
              organization={org}
              initialValue={team}
              label="Select a Team"
              onChange={(team: TeamOption) => {
                if (team && team.name) {
                  navigate(
                    `/${params.gitHubHostname}/org/${params.org}/team/${team.name}`
                  );
                } else if (org && org.name) {
                  navigate(`/${params.gitHubHostname}/org/${org.name}`);
                } else {
                  navigate(`/${params.gitHubHostname}/org`);
                }

                setTeam(team);
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginRight: 2 }}
          >
            <Typography>
              Filter out &gt;{LARGE_PR_LIMIT} line change PRs
            </Typography>
            <Switch
              onChange={handleFilterChange}
              checked={pullRequestSizeLimit === LARGE_PR_LIMIT}
            />
          </Stack>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/dd/yyyy"
            value={startDate}
            onChange={handleChangeStartDate}
            renderInput={(params) => <TextField {...params} />}
          />{' '}
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/dd/yyyy"
            value={endDate}
            onChange={handleChangeEndDate}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
      </Box>
      <br />
      {team && (
        <TeamContributionsMembersHoC
          organization={org}
          team={team}
          startDate={startDate}
          endDate={endDate}
          pullRequestSizeLimit={pullRequestSizeLimit}
        />
      )}
    </Box>
  );
}

export default GitOrgActivityPage;
