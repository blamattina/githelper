import React, { useCallback, useMemo } from 'react';
import format from 'date-fns/format';
import take from 'lodash/take';

type Props = {
  pullRequests: any;
}

function PRStats({pullRequest}: any) {
  return (
    <>
      <span style={{ color: 'green' }}>+{pullRequest.additions}</span>
      <span style={{ color: 'red' }}>-{pullRequest.deletions}</span>
      <span>💬{pullRequest.reviews}</span>
      <span>🕛{pullRequest.cycleTime}</span>
    </>
  )
}

function PullRequestList({pullRequests, label}: any) {
  const renderPullRequest = useCallback((pullRequest: any) => {
    return (
      <li>
        {format(pullRequest.created, 'yyyy-MM-dd')}:{' '}
        <a href={`https://git.hubteam.com/${pullRequest.repo}/issues/${pullRequest.number}`} target="_blank">{pullRequest.title}</a>
        {' '}
        <PRStats pullRequest={pullRequest} />
      </li>
    );
  }, []);

  return (
    <div>
      {label}
      <ul>
        {pullRequests.map(renderPullRequest)}

      </ul>
    </div>
  )
}

function Insights({ pullRequests}: Props) {
  const merged = useMemo(() => pullRequests.filter(pr => pr.state === "MERGED"), [pullRequests]);

  const mostReviewed = useMemo(() => {
      return take([...merged].sort((a: any, b: any) => b.reviews - a.reviews), 3);
    }
  , [merged]);

  const longestCycles = useMemo(() => {
      return take([...merged].sort((a: any, b: any) => b.cycleTime - a.cycleTime), 3);
    }
  , [merged]);

  const biggest = useMemo(() => {
      return take([...merged].sort((a: any, b: any) => (b.additions + b.deletions) - (a.additions + b.deletions)), 3);
    }
  , [merged]);

  return (
    <div>
      <PullRequestList label="Most Reviewed" pullRequests={mostReviewed} />
      <PullRequestList label="Longest Cycles" pullRequests={longestCycles} />
      <PullRequestList label="Biggest" pullRequests={biggest} />
    </div>

  );
}

export default Insights
