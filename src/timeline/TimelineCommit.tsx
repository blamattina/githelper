import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { PullRequestCommit } from '../generated/types';
import { Tooltip, Typography } from '@mui/material';
import CommitIcon from '@mui/icons-material/Commit';
import Link from '@mui/material/Link';
import { red, green } from '@mui/material/colors';
import { PullRequestKeyMetrics } from '../types';

type Props = {
  pullRequestCommit: PullRequestCommit;
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineCommit({
  pullRequestCommit,
  pullRequest,
}: Props) {
  const { commit } = pullRequestCommit;

  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{
          m: 'auto 0',
        }}
        align="right"
      >
        <Typography variant="body2" color="text.secondary">
          {format(new Date(commit.committedDate), 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot>
          <CommitIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent
        sx={{
          m: 'auto 0',
        }}
      >
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          <Link href={commit.author.user.url} target="_blank">
            {commit.author.user.login}
          </Link>{' '}
          commited to{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>
        </Typography>
        <Typography variant="body2">
          {commit.messageHeadline}{' '}
          <span
            style={{
              color: green[500],
            }}
          >
            ++{commit.additions}
          </span>{' '}
          <span
            style={{
              color: red[500],
            }}
          >
            --{commit.deletions}
          </span>{' '}
          <Tooltip
            title={format(
              new Date(commit.committedDate),
              'MMM dd Y hh:mm:ss aa'
            )}
          >
            <Link href={commit.url} target="_blank">
              {commit.abbreviatedOid}
            </Link>
          </Tooltip>
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
