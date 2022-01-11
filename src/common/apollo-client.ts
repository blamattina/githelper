import { ApolloClient, InMemoryCache } from '@apollo/client';
import { relayStylePagination } from "@apollo/client/utilities";

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: { 
      Query: {
        fields: {
          search: relayStylePagination(['query'])
        }
      }
    },
  }),
  uri: `${process.env.REACT_APP_GITHUB_API_URL}/graphql`,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_AUTH_TOKEN}`,
  },
});

export default client;
