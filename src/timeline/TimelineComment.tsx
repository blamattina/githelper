import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { IssueComment } from '../generated/types';
import { Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  issueComment: IssueComment;
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineComment({ issueComment, pullRequest }: Props) {
  console.log(issueComment);
  return (
    <TimelineItem>
      <TimelineOppositeContent align="right" sx={{ m: '10px 0' }}>
        <Typography variant="body2" color="text.secondary">
          {format(new Date(issueComment.createdAt), 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color="info">
          <CommentIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ m: '10px 0' }}>
        <Typography variant="body2">
          <Link
            href={issueComment.author.url}
            target="_blank"
            underline="hover"
          >
            {issueComment.author.login}
          </Link>{' '}
          commmented on{' '}
          <Link href={issueComment.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>
          :
        </Typography>
        <Typography
          variant="body2"
          style={{ wordBreak: 'break-all', width: 600 }}
        >
          {issueComment.bodyText}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
