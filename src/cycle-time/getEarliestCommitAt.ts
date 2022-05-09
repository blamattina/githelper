import takeWhile from 'lodash/takeWhile';
import last from 'lodash/last';
import keyBy from 'lodash/keyBy';
import xorBy from 'lodash/xorBy';
import intersectionBy from 'lodash/intersectionBy';
import differenceBy from 'lodash/differenceBy';
import { hasForcePush } from './hasForcePush';
import {
  CommitHistoryConnection,
  PullRequest,
  CommitEdge,
} from '../generated/types';

function formatDate(date: Date) {
  // Hack to match input format
  return date.toISOString().replace('.000', '');
}

const getEarliestCommitInHistory = (
  history: CommitHistoryConnection,
  baseRefOid: string
) => {
  const historyAfterBaseRef = takeWhile(
    history.edges,
    (edge) => edge.node.oid !== baseRefOid
  );

  // The history is in reverse chronological order;
  const firstCommit = last(historyAfterBaseRef);

  if (firstCommit) {
    return formatDate(new Date(firstCommit.node.committedDate));
  }

  return undefined;
};

const diffForcePushHistories = (baseRef, beforeCommit, afterCommit) => {
  const afterCommitsNotInBase = differenceBy(
    afterCommit.history.edges,
    baseRef.history.edges,
    (edge) => edge.node.oid
  );

  const beforeCommitsNotInBase = differenceBy(
    beforeCommit.history.edges,
    baseRef.history.edges,
    (edge) => edge.node.oid
  );

  const commitsWithDifferentMessages = differenceBy(
    afterCommit.history.edges,
    beforeCommit.history.edges,
    (edge) => edge.node.message
  );

  console.log('before', beforeCommitsNotInBase);
  console.log('after', afterCommitsNotInBase);
  console.log('different messages', commitsWithDifferentMessages);

  // Case #1: Rebasing in changes from the base branch
  // - The same # of commits in the before and after diffs
  if (beforeCommitsNotInBase.length === afterCommitsNotInBase.length) {
    return last(beforeCommitsNotInBase);
  }

  // Case 2: Rebasing in changes that are not in the base branch
  // - More commits after the force push
  if (afterCommitsNotInBase.length > beforeCommitsNotInBase.length) {
    return last(beforeCommitsNotInBase);
  }

  // Case 3: Squashing changes on the branch
  // - More commits before the force push than after
  // - The commit with a different message is also an after commit thats not on the base branch
  if (
    beforeCommitsNotInBase.length > afterCommitsNotInBase.length &&
    intersectionBy(
      afterCommitsNotInBase,
      commitsWithDifferentMessages,
      (edge) => edge.node.oid
    ).length
  ) {
    return last(beforeCommitsNotInBase);
  }

  // Case 4: Rewording commits commits on the base branch
  // - Message changes for one or more commits
  // - new oid's are generated between the head of the branch and the reworded commit
  if (beforeCommitsNotInBase.length > afterCommitsNotInBase.length) {
    const reworded = differenceBy(
      beforeCommit.history.edges,
      baseRef.history.edges.concat(afterCommitsNotInBase),
      (edge) => edge.node.message
    );

    const commits = xorBy(
      beforeCommitsNotInBase,
      reworded,
      (edge) => edge.node.message
    );

    const firstAfterCommit = last(afterCommitsNotInBase);
    return [...commits].find(
      (edge) => edge.node.message === firstAfterCommit.node.message
    );
  }

  return undefined;
};

export const getEarliestCommitAt = (pullRequest: PullRequest) => {
  if (hasForcePush(pullRequest)) {
    const firstForcePush = pullRequest.timelineItems.edges.find(
      ({ node }) => 'beforeCommit' in node && 'afterCommit' in node
    );

    const firstCommit = diffForcePushHistories(
      pullRequest.baseRef.target,
      firstForcePush.node.beforeCommit,
      firstForcePush.node.afterCommit
    );

    if (firstCommit) {
      return firstCommit.node.committedDate;
    }
    return undefined;
  }
  const earliestCommitDate = pullRequest.timelineItems.edges.reduce(
    (acc, { node }) => {
      if ('commit' in node) {
        const authoredDate = new Date(node.commit.authoredDate);
        if (authoredDate < acc) return authoredDate;
      }
      return acc;
    },
    new Date()
  );

  const isostring = earliestCommitDate.toISOString();

  // Hack to match input format
  return isostring.replace('.000', '');
};
