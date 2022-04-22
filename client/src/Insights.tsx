import React, { useCallback, useMemo } from 'react';
import format from 'date-fns/format';
import take from 'lodash/take';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import MergeTypeIcon from '@mui/icons-material/Merge';
import Paper from '@mui/material/Paper';

type Props = {
  pullRequests: any;
};

function PRTitle({ pullRequest }: any) {
  return (
    <Typography noWrap={true}>
      {format(pullRequest.created, 'yyyy-MM-dd')}: {pullRequest.title}
    </Typography>
  );
}

function PRStats({ pullRequest }: any) {
  return (
    <>
      <span style={{ color: 'green' }}>+{pullRequest.additions}</span>
      <span style={{ color: 'red' }}>-{pullRequest.deletions}</span>
      <span>💬{pullRequest.reviews}</span>
      <span>🕛{pullRequest.cycleTime}</span>
    </>
  );
}
function PullRequestList({ pullRequests, label, sort }: any) {
  const merged = useMemo(
    () => pullRequests.filter((pr) => pr.state === 'MERGED'),
    [pullRequests]
  );

  const sorted = useMemo(() => {
    return take([...merged].sort(sort), 5);
  }, [merged]);

  const renderPullRequest = useCallback((pullRequest: any) => {
    return (
      <ListItemButton
        component="a"
        href={`https://git.hubteam.com/${pullRequest.repo}/issues/${pullRequest.number}`}
        target="_blank"
      >
        <ListItemIcon>
          <MergeTypeIcon />
        </ListItemIcon>
        <ListItemText
          primary={<PRTitle pullRequest={pullRequest} />}
          secondary={<PRStats pullRequest={pullRequest} />}
        />
      </ListItemButton>
    );
  }, []);

  return (
    <Paper elevation={0}>
      <List subheader={<ListSubheader>{label}</ListSubheader>}>
        {sorted.map(renderPullRequest)}
      </List>
    </Paper>
  );
}

export default PullRequestList;
