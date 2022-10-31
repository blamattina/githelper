import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { PullRequestReview } from '../generated/types';
import { Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ReviewsIcon from '@mui/icons-material/Reviews';
import CancelIcon from '@mui/icons-material/Cancel';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  event: PullRequestReview;
  pullRequest: PullRequestKeyMetrics;
  leadingEventInGroup: boolean;
  trailingEventInGroup: boolean;
};

export default function TimelineReview({
  event: pullReqiestReview,
  pullRequest,
}: Props) {
  return (
    <TimelineItem>
      <TimelineOppositeContent align="right" sx={{ m: '10px 0' }}>
        <Typography variant="body2" color="text.secondary">
          {format(
            new Date(pullReqiestReview.createdAt),
            'MMM dd Y hh:mm:ss aa'
          )}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        {pullReqiestReview.state === 'APPROVED' ? (
          <TimelineDot color="success">
            <CheckIcon fontSize="small" />
          </TimelineDot>
        ) : pullReqiestReview.state === 'CHANGES_REQUESTED' ? (
          <TimelineDot color="error">
            <CancelIcon fontSize="small" />
          </TimelineDot>
        ) : (
          <TimelineDot color="info">
            <ReviewsIcon fontSize="small" />
          </TimelineDot>
        )}
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ m: '10px 0' }}>
        <Typography variant="body2">
          <Link
            href={pullReqiestReview.author.url}
            target="_blank"
            underline="hover"
          >
            {pullReqiestReview.author.login}
          </Link>{' '}
          reviewed{' '}
          <Link href={pullReqiestReview.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>
        </Typography>
        <Typography
          variant="body2"
          style={{ wordBreak: 'break-word', width: 600 }}
        >
          {pullReqiestReview.bodyText}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
