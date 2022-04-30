import React, { useState, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { GitApiHost } from './types';

type Props = {
  onSave(gitApiHost: GitApiHost): void
}

const GitApiHostForm: React.FC<Props> = ({ onSave }) => {
  const [uri, setUri] = useState('');
  const [token, setToken] = useState('');

  const handleSave = useCallback(() => {
    onSave({ uri, token });
  }, [uri, token, onSave]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh' }}
    >
      <Grid item xs={4}>
        <Typography variant="h2" align="center">Setup</Typography>
        <Typography>Enter GitHub API URI and Personal Access Token</Typography>
        <TextField fullWidth label="GitHub API URI" id="uri" onChange={ e => setUri(e.target.value)} />
        <TextField fullWidth label="Personal Access Token" id="token" onChange={ e => setToken(e.target.value)} />
        <Button variant="text" onClick={handleSave}>Save</Button>
      </Grid>
    </Grid>
  );
}

export default GitApiHostForm;
