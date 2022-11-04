import { PullRequestKeyMetrics } from '../types';
import TimelineOpened from '../timeline/TimelineOpened';
import Timeline from '../timeline/Timeline';
import { useMemo } from 'react';
import { pullReqestToTimelineEvents } from '../timeline/utils';

type Props = {
  pullRequest: PullRequestKeyMetrics;
};

export default function PullRequestRowTimeline({ pullRequest }: Props) {
  const timelineEvents = useMemo(
    () => pullReqestToTimelineEvents(pullRequest),
    [pullRequest]
  );

  return (
    <Timeline
      timelineEvents={timelineEvents}
      initialEvent={<TimelineOpened pullRequest={pullRequest} />}
    />
  );
}
