import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import { LinearProgress } from '@mui/material';
import type { OrganizationOption, TeamOption } from './GitOrgActivityPage';
import { loader } from 'graphql.macro';
import TeamContributions from './TeamContributions';

const TEAM_SEARCH = loader('./queries/team-search.graphql');

const PAGE_SIZE = 15;

type Props = {
  organization: OrganizationOption;
  team: TeamOption;
  startDate: Date;
  endDate: Date;
  pullRequestSizeLimit: number;
};

function TeamContributionsMembersHoC({
  organization,
  team,
  startDate,
  endDate,
  pullRequestSizeLimit,
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

  return (
    <TeamContributions
      organization={organization}
      team={team}
      members={members}
      startDate={startDate}
      endDate={endDate}
      pullRequestSizeLimit={pullRequestSizeLimit}
    />
  );
}

export default TeamContributionsMembersHoC;
