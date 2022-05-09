import { getEarliestCommitAt } from './getEarliestCommitAt';

import pullRequestSquashWithForcePush from './pull-request-squash-with-force-push.json';
import pullReqiestRebaseWithConflicts from './pull-request-rebase-with-conflicts.json';
import pullRequestRebaseFromMain from './pull-request-rebase-changes-from-main.json';
import pullRequestRebaseOverRebasedChanges from './pull-request-rebase-over-rebased-changes.json';

describe('getEarliestCommitAt', () => {
  it('squash with force push', () => {
    expect(getEarliestCommitAt(pullRequestSquashWithForcePush)).toBe(
      '2022-05-08T13:25:11Z'
    );
  });

  it('rebase with conflicts', () => {
    expect(getEarliestCommitAt(pullReqiestRebaseWithConflicts)).toBe(
      '2022-05-08T13:40:50Z'
    );
  });

  it('rebase from main', () => {
    expect(getEarliestCommitAt(pullRequestRebaseFromMain)).toBe(
      '2022-05-08T13:25:11Z'
    );
  });

  it('rebase over rebased changes', () => {
    expect(getEarliestCommitAt(pullRequestRebaseOverRebasedChanges)).toBe(
      '2022-05-08T23:30:23Z'
    );
  });
});
