import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: `${process.env.REACT_APP_GITHUB_API_URL}/graphql`,
  headers: {
    authorization: `Bearer ${process.env.REACT_APP_GITHUB_PERSONAL_AUTH_TOKEN}`,
  },
});

export default client;
