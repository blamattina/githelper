import Tooltip from '@mui/material/Tooltip';
import { red, green } from '@mui/material/colors';
import { PULL_REQUEST_CHANGESET_LIMIT } from '../constants';

type Props = {
  additions: number;
  deletions: number;
  totalCodeChanges: number;
};

export default function TotalCodeChanges({
  additions,
  deletions,
  totalCodeChanges,
}: Props) {
  return (
    <Tooltip
      title={
        <span>
          Total Code Changes: {totalCodeChanges}
          {totalCodeChanges >= PULL_REQUEST_CHANGESET_LIMIT && (
            <p>
              * This PR is quite large and likely includes moved or generated
              files. It is not included in any roll-ups that count total code
              changes.
            </p>
          )}
        </span>
      }
      enterDelay={1000}
    >
      <span>
        <span style={{ color: green[500] }}>++{additions}</span>
        <span style={{ color: red[500] }}>--{deletions}</span>
        {totalCodeChanges >= PULL_REQUEST_CHANGESET_LIMIT && <strong>*</strong>}
      </span>
    </Tooltip>
  );
}
