import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  useGridApiContext,
} from '@mui/x-data-grid';
import { Button, ButtonGroup } from '@mui/material';

function PullRequestTableToolbar() {
  const apiRef = useGridApiContext();

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
