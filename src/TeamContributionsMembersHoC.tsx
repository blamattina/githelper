import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import { LinearProgress } from '@mui/material';
import type { OrganizationOption, TeamOption } from './GitOrgActivityPage';
import { loader } from 'graphql.macro';
import TeamContributions from './TeamContributions';
import { ErrorMessage } from './components/ErrorMessage';
import { WarningAmber } from '@mui/icons-material';

const TEAM_SEARCH = loader('./queries/team-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  organization: OrganizationOption;
  team: TeamOption;
  startDate: Date;
  endDate: Date;
};

function TeamContributionsMembersHoC({
  organization,
  team,
  startDate,
  endDate,
}: Props) {
  let members: any = [];

  const { data, loading } = useQuery(TEAM_SEARCH, {
    variables: {
      org: organization?.name,
      query: team.name,
      pageSize: PAGE_SIZE,
    },
    skip: !team.name,
    notifyOnNetworkStatusChange: true,
  });

  if (data?.organization?.teams?.edges) {
    const currentTeamMembers = data.organization.teams.edges.find(
      (currentTeam: any) => currentTeam.node.name === team.name
    );
    if (currentTeamMembers) {
      members = currentTeamMembers.node.members.nodes;
    }
  }

  if (loading) {
    return (
      <Box sx={{ paddingTop: 20 }}>
        <LinearProgress color="success" />
      </Box>
    );
  }

  if (!members.length) {
    return (
      <ErrorMessage
        title="The selected team has no members"
        Icon={WarningAmber}
        color="info"
      />
    );
  }

  return (
    <TeamContributions
      organization={organization}
      team={team}
      members={members}
      startDate={startDate}
      endDate={endDate}
    />
  );
}

export default TeamContributionsMembersHoC;
