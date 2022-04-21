import { makeSearchInput } from './makeSearchInput';
import { loader } from 'graphql.macro';
import { Organization, TeamMemberEdge } from './generated/types';

const TEAM_SEARCH = loader('./queries/team-search.graphql');

type DataType = {
  organization?: Organization;
};

const TeamSearch = makeSearchInput({
  graphqlQuery: TEAM_SEARCH,
  variables: {
    org: 'HubSpot',
  },
  makeOptions(data: DataType) {
    if (!data || !data.organization || !data.organization.teams) return [];
    return data.organization.teams.edges.map((team: any) => ({
      label: `HubSpot/${team.node.slug}`,
      slug: team.node.slug,
      members: team.node.members.edges.map((i: TeamMemberEdge) => {
        return i.node.login;
      }),
    }));
  },
});

export default TeamSearch;
