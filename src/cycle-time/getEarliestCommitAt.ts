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

function hasSameMessages(a, b) {
  return (
    a.length === b.length &&
    a.every(({ node }, index) => node.message === b[index].node.message)
  );
}

const findFirstCommitInForcePush = (baseRef, beforeCommit, afterCommit) => {
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

  // Case #1: Rebasing in changes from the base branch
  // - The same # of commits in the before and after diffs
  // - The commit messages in afterCommit and beforeCommit are the same
  if (hasSameMessages(afterCommitsNotInBase, beforeCommitsNotInBase)) {
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
      ({ node }) => node.oid
    ).length
  ) {
    return last(beforeCommitsNotInBase);
  }

  // Case 4: Rebasing in changes that rewrite the history of the base branch
  // - Message changes for one or more commits
  // - new oid's are generated between the head of the branch and the reworded commit
  if (beforeCommitsNotInBase.length > afterCommitsNotInBase.length) {
    const reworded = differenceBy(
      beforeCommit.history.edges,
      baseRef.history.edges.concat(afterCommitsNotInBase),
      ({ node }) => node.message
    );

    const commits = xorBy(
      beforeCommitsNotInBase,
      reworded,
      ({ node }) => node.message
    );

    const firstAfterCommit = last(afterCommitsNotInBase);
    return [...commits].find(
      ({ node }) => node.message === firstAfterCommit.node.message
    );
  }

  return undefined;
};

export const getEarliestCommitAt = (pullRequest: PullRequest) => {
  if (hasForcePush(pullRequest)) {
    const firstForcePush = pullRequest.timelineItems.edges.find(
      ({ node }) => 'beforeCommit' in node && 'afterCommit' in node
    );

    const firstCommit = findFirstCommitInForcePush(
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
