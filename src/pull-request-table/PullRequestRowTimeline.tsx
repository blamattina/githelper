import TimelineCommit from '../timeline/TimelineCommit';
import MuiTimeline from '@mui/lab/Timeline';
import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineOppositeContentClasses,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Typography } from '@mui/material';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import TimelineMerged from '../timeline/TimelineMerged';
import TimelineClosed from '../timeline/TimelineClosed';
import TimelineComment from '../timeline/TimelineComment';
import TimelineReview from '../timeline/TimelineReview';
import TimelineLabeled from '../timeline/TimelineLabeled';
import TimelineReopened from '../timeline/TimelineReopened';
import { PullRequestKeyMetrics } from '../types';
import TimelineHeadRefForcePushed from '../timeline/TimelineHeadRefForcePushed';

type Props = {
  pullRequest: PullRequestKeyMetrics;
};

export default function PullRequestRowTimeline({ pullRequest }: Props) {
  const renderItem = (event: any) => {
    switch (event.node.__typename) {
      case 'LabeledEvent': {
        return (
          <TimelineLabeled
            key={event.node.id}
            labeledEvent={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'MergedEvent': {
        return (
          <TimelineMerged
            key={event.node.id}
            mergedEvent={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'ReopenedEvent': {
        return (
          <TimelineReopened
            key={event.node.id}
            reopenedEvent={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'HeadRefForcePushedEvent': {
        return (
          <TimelineHeadRefForcePushed
            headRefForcePushedEvent={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'ClosedEvent': {
        return (
          <TimelineClosed
            key={event.node.id}
            closedEvent={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'PullRequestReview': {
        return (
          <TimelineReview
            key={event.node.id}
            pullReqiestReview={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'PullRequestCommit': {
        return (
          <TimelineCommit
            pullRequestCommit={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      case 'IssueComment': {
        return (
          <TimelineComment
            key={event.node.id}
            issueComment={event.node}
            pullRequest={pullRequest}
          />
        );
      }

      default: {
        return null;
      }
    }
  };
  return (
    <MuiTimeline
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: 0.3,
        },
      }}
    >
      {pullRequest.timeline.map(renderItem)}
    </MuiTimeline>
  );
}
