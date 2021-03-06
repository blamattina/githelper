import differenceInBusinessDays from 'date-fns/differenceInBusinessDays';

import { PullRequest, PullRequestReviewEdge } from '../generated/types';

type PullRequestPredicateType = (
  edge: PullRequestReviewEdge,
  pullRequest: PullRequest
) => boolean;
type PrReviewEdgesSort = (
  edges: PullRequestReviewEdge[]
) => PullRequestReviewEdge[];

function findReviewTime(
  predicate: PullRequestPredicateType,
  sort?: PrReviewEdgesSort
) {
  return (pullRequest: PullRequest): string => {
    const { edges } = pullRequest.reviews;

    const sorted = sort ? sort(edges) : edges;
    const review = sorted.find((edge) => predicate(edge, pullRequest));

    if (review && 'node' in review) {
      return review.node.submittedAt;
    }

    return '';
  };
}

export function findDeploymentTime(
  pullRequest: PullRequest
): string | undefined {
  const { edges } = pullRequest.timelineItems;

  const deploymentEvent = edges.find((edge) => {
    return 'label' in edge.node && edge.node.label.name === 'deployed-PROD';
  });

  if (deploymentEvent && 'createdAt' in deploymentEvent.node)
    return deploymentEvent.node.createdAt;
  return undefined;
}

export const findInitialReviewTime = findReviewTime(
  (edge, pullRequest) =>
    edge.node.author.login !== pullRequest.author.login &&
    edge.node.state !== 'PENDING'
);
export const findLastReviewTime = findReviewTime(
  (edge, pullRequest) =>
    edge.node.author.login !== pullRequest.author.login &&
    edge.node.state !== 'PENDING' &&
    pullRequest.mergedAt &&
    new Date(edge.node.submittedAt) < new Date(pullRequest.mergedAt),
  (edges) => [...edges].reverse()
);

export function daysToFirstReview(
  pullRequest: PullRequest
): number | undefined {
  const initialReviewTime = findInitialReviewTime(pullRequest);

  if (!initialReviewTime) return undefined;

  return differenceInBusinessDays(
    new Date(initialReviewTime),
    new Date(pullRequest.createdAt)
  );
}

export function reworkTimeInDays(pullRequest: PullRequest): number | undefined {
  const initialTime = findInitialReviewTime(pullRequest);
  const lastReviewTime = findLastReviewTime(pullRequest);

  if (!initialTime || !lastReviewTime) return undefined;

  return differenceInBusinessDays(
    new Date(lastReviewTime),
    new Date(initialTime)
  );
}

export function waitingToDeploy(pullRequest: PullRequest): number | undefined {
  const lastReviewTime = findLastReviewTime(pullRequest);
  const deploymentTime = findDeploymentTime(pullRequest);

  if (!deploymentTime || !lastReviewTime) return undefined;

  return differenceInBusinessDays(
    new Date(deploymentTime),
    new Date(lastReviewTime)
  );
}

export function cycleTime(pullRequest: PullRequest): number | undefined {
  if (pullRequest.state !== 'MERGED') {
    return undefined;
  }

  const endTime = findDeploymentTime(pullRequest) || pullRequest.mergedAt;
  return differenceInBusinessDays(
    new Date(endTime),
    new Date(pullRequest.createdAt)
  );
}
