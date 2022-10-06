import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import GitOrgChooser from './GitOrgChooser';
import GitTeamChooser from './GitTeamChooser';
import TeamContributionsMembersHoC from './TeamContributionsMembersHoC';
import format from 'date-fns/format';
import DateRangeSelect from './date-range-select/DateRangeSelect';
import { useDateRange } from './date-range-select/useDateRange';

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

  const {
    startDate,
    endDate,
    startDateOffset,
    setStartDateOffset,
    setEndDate,
  } = useDateRange();

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

  //Handle corner case in state when page transitions
  if (org && params.org === undefined) {
    setOrg(null);
    setTeam(null);
  }

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
        <Box>
          <DateRangeSelect
            endDate={endDate}
            startDateOffset={startDateOffset}
            onStartDateOffsetChange={setStartDateOffset}
            onEndDateChange={setEndDate}
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
        />
      )}
    </Box>
  );
}

export default GitOrgActivityPage;
