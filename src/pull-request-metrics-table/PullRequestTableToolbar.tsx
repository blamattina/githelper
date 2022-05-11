import { Box, Button, ButtonGroup } from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarExport,
  useGridApiContext,
} from '@mui/x-data-grid';
import { GridApiCommunity } from '@mui/x-data-grid/models/api/gridApiCommunity';

function compareCurrentSortState(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  column: string,
  direction: string
) {
  const currentSortModel = apiRef.current.getSortModel();

  if (
    currentSortModel &&
    currentSortModel.length > 0 &&
    currentSortModel[0].field === column &&
    currentSortModel[0].sort === direction
  ) {
    return true;
  }

  return false;
}

function PullRequestTableToolbar() {
  const apiRef = useGridApiContext();

  return (
    <GridToolbarContainer style={{ height: 50 }}>
      <ButtonGroup variant="text">
        <Button
          disabled={compareCurrentSortState(apiRef, 'created', 'desc')}
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
          disabled={compareCurrentSortState(apiRef, 'reviews', 'desc')}
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
          disabled={compareCurrentSortState(apiRef, 'cycleTime', 'desc')}
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
          disabled={compareCurrentSortState(apiRef, 'totalCodeChanges', 'desc')}
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
      <Box sx={{ flexGrow: 1 }}></Box>
      <GridToolbarColumnsButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default PullRequestTableToolbar;
