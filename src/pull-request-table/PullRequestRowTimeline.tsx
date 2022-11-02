import TimelineCommit from '../timeline/TimelineCommit';
import MuiTimeline from '@mui/lab/Timeline';
import { timelineOppositeContentClasses } from '@mui/lab';
import TimelineMerged from '../timeline/TimelineMerged';
import TimelineClosed from '../timeline/TimelineClosed';
import TimelineComment from '../timeline/TimelineComment';
import TimelineReview from '../timeline/TimelineReview';
import TimelineLabeled from '../timeline/TimelineLabeled';
import TimelineReopened from '../timeline/TimelineReopened';
import { PullRequestKeyMetrics } from '../types';
import TimelineHeadRefForcePushed from '../timeline/TimelineHeadRefForcePushed';
import { PullRequestTimelineItemsEdge } from '../generated/types';
import TimelineOpened from '../timeline/TimelineOpened';

type Props = {
  pullRequest: PullRequestKeyMetrics;
};

function leadingEventInGroup(
  event: PullRequestTimelineItemsEdge,
  index: number,
  timeline: PullRequestTimelineItemsEdge[]
) {
  if (index === 0) return true;
  const previousEvent = timeline[index - 1];
  return event.node.__typename !== previousEvent.node.__typename;
}

function trailingEventInGroup(
  event: PullRequestTimelineItemsEdge,
  index: number,
  timeline: PullRequestTimelineItemsEdge[]
) {
  if (index >= timeline.length - 1) return true;
  const nextEvent = timeline[index + 1];
  return event.node.__typename !== nextEvent.node.__typename;
}

function getKey(event: PullRequestTimelineItemsEdge) {
  if ('id' in event.node) return event.node.id;
  return event.node.createdAt;
}

export default function PullRequestRowTimeline({ pullRequest }: Props) {
  const renderItem = (
    event: PullRequestTimelineItemsEdge,
    index: number,
    timeline: PullRequestTimelineItemsEdge[]
  ) => {
    const propsToPass = {
      key: getKey(event),
      pullRequest,
      leadingEventInGroup: leadingEventInGroup(event, index, timeline),
      trailingEventInGroup: trailingEventInGroup(event, index, timeline),
    };

    switch (event.node.__typename) {
      case 'LabeledEvent': {
        return <TimelineLabeled event={event.node} {...propsToPass} />;
      }

      case 'MergedEvent': {
        return <TimelineMerged event={event.node} {...propsToPass} />;
      }

      case 'ReopenedEvent': {
        return <TimelineReopened event={event.node} {...propsToPass} />;
      }

      case 'HeadRefForcePushedEvent': {
        return (
          <TimelineHeadRefForcePushed event={event.node} {...propsToPass} />
        );
      }

      case 'ClosedEvent': {
        return <TimelineClosed event={event.node} {...propsToPass} />;
      }

      case 'PullRequestReview': {
        return <TimelineReview event={event.node} {...propsToPass} />;
      }

      case 'PullRequestCommit': {
        return <TimelineCommit event={event.node} {...propsToPass} />;
      }

      case 'IssueComment': {
        return <TimelineComment event={event.node} {...propsToPass} />;
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
      <TimelineOpened pullRequest={pullRequest} />
      {pullRequest.timeline.map(renderItem)}
    </MuiTimeline>
  );
}
