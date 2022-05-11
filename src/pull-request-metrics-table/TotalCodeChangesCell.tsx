import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { red, green } from '@mui/material/colors';

type Props = {
  additions: number;
  deletions: number;
  totalCodeChanges: number;
};

const TotalCodeChangesCell: React.FC<Props> = ({
  additions,
  deletions,
  totalCodeChanges,
}) => {
  return (
    <Tooltip
      title={`Total Code Changes: ${totalCodeChanges}`}
      enterDelay={1000}
    >
      <span>
        <span style={{ color: green[500] }}>++{additions}</span>
        <span style={{ color: red[500] }}>--{deletions}</span>
      </span>
    </Tooltip>
  );
};

export default TotalCodeChangesCell;
