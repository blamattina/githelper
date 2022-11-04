import { useMemo } from 'react';
import Timeline from './Timeline';
import { pullReqestToTimelineEvents } from './utils';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  pullRequests: PullRequestKeyMetrics[];
};

export function TimelineTabContent({ pullRequests }: Props) {
  const timelineEvents = useMemo(() => {
    return pullRequests
      .map(pullReqestToTimelineEvents)
      .flat()
      .sort((a, b) => b.ts - a.ts);
  }, [pullRequests]);

  return <Timeline timelineEvents={timelineEvents} />;
}
