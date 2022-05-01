import React, { useState, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import { addGitHubToken } from './tokenStore';

const GitApiHostForm: React.FC = () => {
  const [hostname, setHostname] = useState('api.github.com');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleSave = useCallback(() => {
    addGitHubToken({
      hostname,
      token
    });
    navigate(`/${hostname}`);
  }, [hostname, token, navigate]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh' }}
    >
      <Grid item xs={6}>
        <Paper elevation={0} sx={{ padding: 4 }}>
          <Typography variant="h4" sx={{ marginBottom: 6 }}>
            Add GitHub Server
          </Typography>
          <TextField
            fullWidth
            label="GitHub server hostname"
            id="hostname"
            helperText="For GitHub Enterprise enter the hostname of server eg: git.mycompany.com"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            sx ={{ marginBottom: 4 }}
          />
          <TextField
            fullWidth
            label="Personal Access Token"
            id="token"
            helperText="TODO add required scopes"
            onChange={(e) => setToken(e.target.value)}
            value={token}
            sx ={{ marginBottom: 4 }}
          />
          <Button variant="outlined" onClick={handleSave}>
            Save
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default GitApiHostForm;
