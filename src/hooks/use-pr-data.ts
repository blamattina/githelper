import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

export const PR_DATA_QUERY = loader('./use-pr-data.graphql');

export default function usePrData(authors: string[]) {
  const query = `is:PR ${authors.map(a => `author:${a}`).join(' ')}`;

  return useQuery(PR_DATA_QUERY, {
    variables: {
      query,
      pageSize: 50,
    },
  });
}
