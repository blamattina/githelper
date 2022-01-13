import takeWhile from 'lodash/takeWhile';
import { CommitHistoryConnection, PullRequest } from '../generated/types';

const getEarliestCommitInHistory = (
  history: CommitHistoryConnection,
  baseRefOid: string,
  earliestDate: Date
) => {
  const historyAfterBaseRef = takeWhile(
    history.edges,
    (edge) => edge.node.oid !== baseRefOid
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
  const { baseRefOid } = pullRequest;

  const earliestCommitDate = pullRequest.timelineItems.edges.reduce(
    (acc, { node }) => {
      // Commits
      if ('commit' in node) {
        const authoredDate = new Date(node.commit.authoredDate);
        if (authoredDate < acc) return authoredDate;
      }

      // Force pushes
      if ('beforeCommit' in node) {
        return getEarliestCommitInHistory(
          node.beforeCommit.history,
          baseRefOid,
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
