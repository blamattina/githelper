import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { ReopenedEvent } from '../generated/types';
import { Typography } from '@mui/material';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  reopenedEvent: ReopenedEvent;
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineReopened({
  reopenedEvent,
  pullRequest,
}: Props) {
  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{
          m: 'auto 0',
        }}
        align="right"
      >
        <Typography variant="body2" color="text.secondary">
          {format(new Date(reopenedEvent.createdAt), 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color="info">
          <OpenInBrowserIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          m: 'auto 0',
        }}
      >
        <Typography variant="body2">
          <Link href={reopenedEvent.actor.url} target="_blank">
            {reopenedEvent.actor.login}
          </Link>{' '}
          reopened{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>{' '}
          {pullRequest.title}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
