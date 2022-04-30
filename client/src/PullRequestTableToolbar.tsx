import React from 'react';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  useGridApiContext,
} from '@mui/x-data-grid';
import {
  Button,
  ButtonGroup,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

function PullRequestTableToolbar() {
  const [preset, setPreset] = React.useState('');
  const apiRef = useGridApiContext();
  const defaultState = apiRef.current.exportState();

  const handlePreset = (
    event: React.MouseEvent<HTMLElement>,
    newPreset: string | null
  ) => {
    console.log(newPreset);
    if (newPreset) {
      setPreset(newPreset);

      if (newPreset === 'reviews') {
        const reviewsColumn = apiRef.current.getColumn('reviews');
        apiRef.current.sortColumn(reviewsColumn, 'desc');
      } else if (newPreset === 'cycles') {
        const cycleTimeColumn = apiRef.current.getColumn('cycleTime');
        apiRef.current.sortColumn(cycleTimeColumn, 'desc');
      } else if (newPreset === 'changes') {
        const changesColumn = apiRef.current.getColumn('totalCodeChanges');
        apiRef.current.sortColumn(changesColumn, 'desc');
      }
    } else {
      setPreset('');
      apiRef.current.restoreState(defaultState);
    }
  };

  return (
    <GridToolbarContainer style={{ height: 50 }}>
      <ButtonGroup variant="text">
        <Button
          onClick={() => {
            apiRef.current.sortColumn(
              apiRef.current.getColumn('created'),
              'desc'
            );
          }}
        >
          Created At
        </Button>
        <Button
          onClick={() => {
            apiRef.current.sortColumn(
              apiRef.current.getColumn('reviews'),
              'desc'
            );
          }}
        >
          Most Reviewed
        </Button>
        <Button
          onClick={() => {
            apiRef.current.sortColumn(
              apiRef.current.getColumn('cycleTime'),
              'desc'
            );
          }}
        >
          Longest Cycles
        </Button>
        <Button
          onClick={() => {
            apiRef.current.sortColumn(
              apiRef.current.getColumn('totalCodeChanges'),
              'desc'
            );
          }}
        >
          Most Changes
        </Button>
      </ButtonGroup>

      <GridToolbarColumnsButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default PullRequestTableToolbar;
