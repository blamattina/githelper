import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { MergedEvent } from '../generated/types';
import { Typography } from '@mui/material';
import MergeIcon from '@mui/icons-material/Merge';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  mergedEvent: MergedEvent;
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineMerged({ mergedEvent, pullRequest }: Props) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{
          m: 'auto 0',
        }}
        align="right"
      >
        <Typography variant="body2" color="text.secondary">
          {format(new Date(mergedEvent.createdAt), 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color="secondary">
          <MergeIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          m: 'auto 0',
        }}
      >
        <Typography variant="body2">
          <Link href={mergedEvent.actor.url} target="_blank">
            {mergedEvent.actor.login}
          </Link>{' '}
          merged{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>{' '}
          into {mergedEvent.mergeRefName}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
