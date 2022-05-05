import React, { useContext } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import {
  AppBar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { GitHubTokensContext } from './GitHubTokensProvider';
import { NavLink } from 'react-router-dom';

const headerLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: 'white',
  textDecoration: 'none',
  padding: 10,
  margin: 10,
});

const buttonStyle = ({ isActive }: { isActive: boolean }) => ({
  color: 'black',
  textDecoration: 'none',
  padding: 10,
  margin: 10,
});

const GitHubServerNav: React.FC = () => {
  const { gitHubHostname } = useParams();
  const { getGitHubTokens } = useContext(GitHubTokensContext);

  const gitHubTokens = getGitHubTokens();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, minHeight: 90 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              GitHelper {gitHubHostname && `(${gitHubHostname})`}
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {gitHubHostname && (
                <Button
                  key={'page'}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  <NavLink
                    to={`/${gitHubHostname}/users`}
                    style={headerLinkStyle}
                  >
                    User Dashboard
                  </NavLink>
                </Button>
              )}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={'setting'} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <NavLink to="new" style={buttonStyle}>
                      Add GitHub server
                    </NavLink>
                  </Typography>
                </MenuItem>

                {gitHubTokens && gitHubTokens.length > 0 && <Divider />}

                {gitHubTokens.map(({ hostname }) => (
                  <MenuItem
                    key={`setting-${hostname}`}
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">
                      <NavLink key={hostname} to={hostname} style={buttonStyle}>
                        Switch to {hostname}
                      </NavLink>
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
};

export default GitHubServerNav;
