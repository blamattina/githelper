import takeWhile from 'lodash/takeWhile';
import keyBy from 'lodash/keyBy';
import {
  CommitHistoryConnection,
  PullRequest,
  CommitEdge,
} from '../generated/types';

const getEarliestCommitInHistory = (
  history: CommitHistoryConnection,
  afterCommitMap: Record<string, any>,
  earliestDate: Date
) => {
  const historyAfterBaseRef = takeWhile(
    history.edges,
    (edge) => !afterCommitMap[edge.node.oid]
  );

  return historyAfterBaseRef.reduce(
    (acc: Date, { node: historyNode }): Date => {
      const committedDate = new Date(historyNode.committedDate);
      if (committedDate < acc) return committedDate;
      return acc;
    },
    earliestDate
  );
};

export const getEarliestCommitAt = (pullRequest: PullRequest) => {
  const earliestCommitDate = pullRequest.timelineItems.edges.reduce(
    (acc, { node }) => {
      // Commits
      if ('commit' in node) {
        const authoredDate = new Date(node.commit.authoredDate);
        if (authoredDate < acc) return authoredDate;
      }

      // Force pushes
      if (
        'beforeCommit' in node &&
        'afterCommit' in node &&
        node.beforeCommit &&
        node.afterCommit
      ) {
        const afterCommitMap = keyBy(
          node.afterCommit.history.edges,
          (connection: CommitEdge) => connection.node.oid
        );

        return getEarliestCommitInHistory(
          node.beforeCommit.history,
          afterCommitMap,
          acc
        );
      }

      return acc;
    },
    new Date()
  );

  const isostring = earliestCommitDate.toISOString();

  // Hack to match input format
  return isostring.replace('.000', '');
};
