import { Chip } from '@mui/material';

type Props = {
  state: string;
};

export default function PullRequestStateChip({ state }: Props) {
  return (
    <Chip
      label={state}
      size="small"
      variant="outlined"
      color={
        state === 'CLOSED'
          ? 'error'
          : state === 'MERGED'
          ? 'secondary'
          : 'success'
      }
    />
  );
}
