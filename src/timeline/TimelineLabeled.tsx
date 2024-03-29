import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { LabeledEvent } from '../generated/types';
import { Typography } from '@mui/material';
import LabelIcon from '@mui/icons-material/Label';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  event: LabeledEvent;
  pullRequest: PullRequestKeyMetrics;
  leadingEventInGroup: boolean;
  trailingEventInGroup: boolean;
};

export default function TimelineLabeled({
  event: labeledEvent,
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
          {format(new Date(labeledEvent.createdAt), 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color="info">
          <LabelIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          m: 'auto 0',
        }}
      >
        <Typography variant="body2">
          <Link href={labeledEvent.actor.url} target="_blank" underline="hover">
            {labeledEvent.actor.login}
          </Link>{' '}
          labeled{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>{' '}
          with {labeledEvent.label.name}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
