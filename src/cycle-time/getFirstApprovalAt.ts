export const getFirstApprovalAt = (reviews: any): string => {
  try {
    return reviews.edges.find((review: any) => review.node.state === 'APPROVED')
      .node.submittedAt;
  } catch (e) {
    return '';
  }
};
