import pullRequestWithPendingReview from './pull-request-with-pending-review.json';
import pullRequestWithPendingAndSubmittedReviews from './pull-request-with-pending-and-submitted-review.json';
import {
  findInitialReviewTime,
  findLastReviewTime,
  reworkTimeInDays,
} from '../reviewTime';

describe('reviewTime', () => {
  describe('findInitialReviewTime', () => {
    it('ignores PENDING reviews', () => {
      expect(findInitialReviewTime(pullRequestWithPendingReview)).toBe('');
      expect(
        findInitialReviewTime(pullRequestWithPendingAndSubmittedReviews)
      ).toBe('2022-04-29T18:29:45Z');
    });
  });

  describe('findLastReviewTime', () => {
    it('ignores PENDING reviews', () => {
      expect(findLastReviewTime(pullRequestWithPendingReview)).toBe('');
      expect(
        findLastReviewTime(pullRequestWithPendingAndSubmittedReviews)
      ).toBe('2022-04-29T18:29:45Z');
    });
  });

  describe('reworkTimeInDays', () => {
    it('ignores PENDING reviews', () => {
      expect(reworkTimeInDays(pullRequestWithPendingReview)).toBe(undefined);
      expect(reworkTimeInDays(pullRequestWithPendingAndSubmittedReviews)).toBe(
        0
      );
    });
  });
});
