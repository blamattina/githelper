import { Chip } from '@mui/material';

type Props = {
  state: string;
  isDraft: boolean;
};

export default function PullRequestStateChip({ state, isDraft }: Props) {
  return (
    <Chip
      label={state === 'OPEN' && isDraft ? 'DRAFT' : state}
      size="small"
      variant="outlined"
      color={
        state === 'CLOSED'
          ? 'error'
          : state === 'MERGED'
          ? 'secondary'
          : isDraft
          ? 'info'
          : 'success'
      }
    />
  );
}
