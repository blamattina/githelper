import React from 'react';
import { PullRequest } from './generated/types';

type Props = {
  pullRequest: PullRequest
}

function PrTableRow({ pullRequest }: Props) {
  console.log(pullRequest);
  return (
    <tr className="PrTable">
      <td>{pullRequest.author.login}</td>
      <td>{pullRequest.title}</td>
    </tr>
  );
}

export default PrTableRow;
