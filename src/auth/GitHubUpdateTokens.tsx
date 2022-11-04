import React, { useContext, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const GitHubUpdateTokens: React.FC = () => {
  const { addGitHubToken, deleteGitHubToken, getGitHubTokens } =
    useContext(GitHubTokensContext);

  const [updateKeys, setUpdateKeys] = useState<{ [key: string]: string }>({});
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateHostname, setUpdateHostname] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteHostname, setDeleteHostname] = useState('');
  const [gitHubTokens, setGitHubTokens] = useState(getGitHubTokens());

  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: 'pageview',
      page: '/manage',
    });
  }, [location.pathname]);

  const handleClickUpdateOpen = (hostname: string) => {
    setUpdateHostname(hostname);
    setUpdateOpen(true);
  };

  const handleClickUpdateConfirm = () => {
    const newToken = {
      hostname: updateHostname,
      token: updateKeys[updateHostname],
    };

    deleteGitHubToken(newToken);
    addGitHubToken(newToken);
    updateKeys[updateHostname] = '';
    setUpdateKeys(updateKeys);

    handleClickUpdateClose();
  };

  const handleClickUpdateClose = () => {
    setUpdateHostname('');
    setUpdateOpen(false);
  };

  const handleClickDeleteOpen = (hostname: string) => {
    setDeleteHostname(hostname);
    setDeleteOpen(true);
  };

  const handleClickDeleteConfirm = () => {
    deleteGitHubToken({
      hostname: deleteHostname,
      token: '',
    });

    setGitHubTokens(
      gitHubTokens.filter(
        (gitHubToken) => gitHubToken.hostname !== deleteHostname
      )
    );

    handleClickDeleteClose();
  };

  const handleClickDeleteClose = () => {
    setDeleteHostname('');
    setDeleteOpen(false);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item xs={8}>
        <Paper elevation={0} sx={{ padding: 4 }}>
          <Typography variant="h4" sx={{ marginBottom: 6 }}>
            Manage GitHub Keys
          </Typography>

          {gitHubTokens.map(({ hostname }: { hostname: string }) => (
            <Paper sx={{ padding: '8px', margin: '8px' }} key={hostname}>
              <Grid container>
                <Grid item xs={4}>
                  <Typography variant="subtitle1" sx={{ margin: '8px' }}>
                    {hostname}
                  </Typography>
                </Grid>

                <Grid item xs={8}>
                  <Box display="flex" justifyContent="flex-end">
                    <TextField
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        let updateKeysObj = { ...updateKeys };
                        updateKeysObj[hostname] = event.target.value;
                        setUpdateKeys(updateKeysObj);
                      }}
                      size="small"
                      sx={{ margin: '8px' }}
                      value={updateKeys[hostname] || ''}
                      InputProps={{
                        endAdornment: (
                          <Button
                            onClick={() => handleClickUpdateOpen(hostname)}
                          >
                            Update
                          </Button>
                        ),
                      }}
                    ></TextField>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ margin: '8px' }}
                      startIcon={<DeleteIcon />}
                      onClick={() => handleClickDeleteOpen(hostname)}
                    >
                      Delete Key
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Paper>
      </Grid>
      <Dialog open={updateOpen}>
        <DialogTitle>
          {`Are you sure you want to update the key for ${updateHostname}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Updating this key cannot be undone. Your current key will be cleared
            and unretrievable.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickUpdateClose}>Disagree</Button>
          <Button onClick={handleClickUpdateConfirm} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen}>
        <DialogTitle>
          {`Are you sure you want to delete the key for ${deleteHostname}?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deleting this key cannot be undone. You will be able to add a new
            key later, but any data associated with this git server will be
            lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickDeleteClose}>Disagree</Button>
          <Button onClick={handleClickDeleteConfirm} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default GitHubUpdateTokens;
