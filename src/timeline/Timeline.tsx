import TimelineCommit from './TimelineCommit';
import MuiTimeline from '@mui/lab/Timeline';
import { timelineOppositeContentClasses } from '@mui/lab';
import TimelineMerged from './TimelineMerged';
import TimelineClosed from './TimelineClosed';
import TimelineComment from './TimelineComment';
import TimelineReview from './TimelineReview';
import TimelineLabeled from './TimelineLabeled';
import TimelineReopened from './TimelineReopened';
import TimelineHeadRefForcePushed from './TimelineHeadRefForcePushed';
import { getKey, leadingEventInGroup, trailingEventInGroup } from './utils';
import { TimelineEvent } from './types';

type Props = {
  initialEvent?: React.ReactNode;
  timelineEvents: TimelineEvent[];
};

export default function Timeline({ timelineEvents, initialEvent }: Props) {
  const renderItem = (
    event: TimelineEvent,
    index: number,
    timeline: TimelineEvent[]
  ) => {
    const propsToPass = {
      key: getKey(event),
      pullRequest: event.pullRequest,
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
      {initialEvent || null}
      {timelineEvents.map(renderItem)}
    </MuiTimeline>
  );
}
