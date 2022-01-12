import { makeSearchInput } from './makeSearchInput';
import { loader } from 'graphql.macro';

const USER_SEARCH = loader('./queries/user-search.graphql');

const UserSearch = makeSearchInput({
  graphqlQuery: USER_SEARCH,
  makeOptions(data = { search: { edges: [] } }) {
    return data.search.edges.map((user: any) => ({
      label: `${user.node.name} (${user.node.login})`,
      value: user.node.login,
    }));
  },
});

export default UserSearch;
