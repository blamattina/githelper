import { format } from 'date-fns';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import Link from '@mui/material/Link';
import { PullRequestKeyMetrics } from '../types';
import TruncatedHtml from '../html/TruncatedHtml';

type Props = {
  pullRequest: PullRequestKeyMetrics;
};

export default function TimelineOpened({ pullRequest }: Props) {
  return (
    <TimelineItem>
      <TimelineOppositeContent align="right" sx={{ m: '10px 0' }}>
        <Typography variant="body2" color="text.secondary">
          {format(pullRequest.created, 'MMM dd Y hh:mm:ss aa')}
        </Typography>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot color="info">
          <CreateIcon fontSize="small" />
        </TimelineDot>
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ m: '10px 0' }}>
        <Typography variant="body2" component="div">
          <Link href={pullRequest.authorUrl} target="_blank" underline="hover">
            {pullRequest.author}
          </Link>{' '}
          opened{' '}
          <Link href={pullRequest.url} target="blank" underline="hover">
            {pullRequest.repo}#{pullRequest.number}
          </Link>
          :
        </Typography>
        <Typography
          variant="body2"
          style={{ wordBreak: 'break-word', width: 600 }}
          component="div"
        >
          <TruncatedHtml html={pullRequest.bodyHTML} />
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
