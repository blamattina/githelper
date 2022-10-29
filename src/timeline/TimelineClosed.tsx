import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { ClosedEvent } from '../generated/types';
import { Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  closedEvent: ClosedEvent;
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineClosed({ closedEvent, pullRequest }: Props) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{
          m: 'auto 0',
        }}
        align="right"
      >
        <Typography variant="body2" color="text.secondary">
          {format(new Date(closedEvent.createdAt), 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color="error">
          <CloseIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          m: 'auto 0',
        }}
      >
        <Typography variant="body2">
          <Link href={closedEvent.actor.url} target="_blank">
            {closedEvent.actor.login}
          </Link>{' '}
          closed{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>{' '}
          {pullRequest.title}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
