import { makeSearchInput } from './makeSearchInput';
import { loader } from 'graphql.macro';

const USER_SEARCH = loader('./queries/user-search.graphql');

const UserSearch = makeSearchInput({
  graphqlQuery: USER_SEARCH,
  makeOptions(data = { search: { edges: [] } }) {
    console.log(data);
    return data.search.edges.map((user: any) => ({
      label: `${user.node.name} (${user.node.login})`,
      login: user.node.login,
      name: user.node.name,
      
    }));
  },
});

export default UserSearch;
