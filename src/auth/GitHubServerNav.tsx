import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { NavLink } from 'react-router-dom';

// TODO Integrate NavLink into MUI
const buttonStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? 'black' : 'blue',
  textDecoration: isActive ? 'none' : 'underline',
  padding: 10,
  margin: 10,
});

const GitHubServerNav: React.FC = () => {
  const { getGitHubTokens } = useContext(GitHubTokensContext);

  const gitHubTokens = getGitHubTokens();

  return (
    <>
      <Box>
        {gitHubTokens.map(({ hostname }) => (
          <NavLink key={hostname} to={hostname} style={buttonStyle}>
            {hostname}
          </NavLink>
        ))}
        <NavLink to="new" style={buttonStyle}>
          Add GitHub server
        </NavLink>
      </Box>
      <Outlet />
    </>
  );
};

export default GitHubServerNav;
