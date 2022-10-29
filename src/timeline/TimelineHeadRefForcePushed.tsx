import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { HeadRefForcePushedEvent } from '../generated/types';
import { Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';
import { SaveAs } from '@mui/icons-material';

type Props = {
  headRefForcePushedEvent: HeadRefForcePushedEvent;
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineHeadRefForcePushed({
  headRefForcePushedEvent,
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
          {format(
            new Date(headRefForcePushedEvent.createdAt),
            'MMM dd Y hh:mm:ss aa'
          )}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot color="warning">
          <SaveAs fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          m: 'auto 0',
        }}
      >
        <Typography variant="body2">
          <Link
            href={headRefForcePushedEvent.actor.url}
            target="_blank"
            underline="hover"
          >
            {headRefForcePushedEvent.actor.login}
          </Link>{' '}
          force pushed{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>{' '}
          from{' '}
          <Link
            href={headRefForcePushedEvent.beforeCommit.url}
            target="blank"
            underline="hover"
          >
            {headRefForcePushedEvent.beforeCommit.abbreviatedOid}
          </Link>{' '}
          to{' '}
          <Link
            href={headRefForcePushedEvent.afterCommit.url}
            target="blank"
            underline="hover"
          >
            {headRefForcePushedEvent.afterCommit.abbreviatedOid}
          </Link>
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
