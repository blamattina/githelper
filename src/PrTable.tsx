import React from 'react';
import usePrData from './hooks/use-pr-data';
import { PullRequest, SearchResultItemEdge } from './generated/types';
import PrTableRow from './PrTableRow';

type Props = {
  authors: string[]
}

function PrTable({ authors }: Props) {
  const { data, loading, error } = usePrData(authors);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>ERROR! {error.message}</div>;

  return (
    <table className="PrTable">
        {data.search.edges.map(({ node }: SearchResultItemEdge) => {
          return <PrTableRow pullRequest={node as PullRequest} />
        })}
    </table>
  );
}

export default PrTable;
