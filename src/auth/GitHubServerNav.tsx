import React, { useContext } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
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
import Container from '@mui/material/Container';

const headerLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: 'white',
  textDecoration: 'none',
  padding: 10,
  margin: 10,
});

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: 'black',
  textDecoration: 'none',
  padding: 10,
  margin: 10,
});

const selectedinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: '#2196f3',
  textDecoration: 'none',
  fontWeight: 'bold',
  padding: 10,
  margin: 10,
});

const GitHubServerNav: React.FC = () => {
  const location = useLocation();

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

  const isUserPage = location.pathname.startsWith(`/${gitHubHostname}/users`);
  const isOrgPage = location.pathname.startsWith(`/${gitHubHostname}/org`);
  const isRepoPage = location.pathname.startsWith(`/${gitHubHostname}/repo`);

  return (
    <>
      <Box sx={{ flexGrow: 1, minHeight: 90 }}>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
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
                    key={'user-page'}
                    sx={
                      isUserPage
                        ? {
                            my: 2,
                            color: 'white',
                            display: 'block',
                            fontWeight: 'bold',
                          }
                        : {
                            my: 2,
                            color: 'white',
                            display: 'block',
                          }
                    }
                  >
                    <NavLink
                      to={`/${gitHubHostname}/users`}
                      style={headerLinkStyle}
                    >
                      User Dashboard
                    </NavLink>
                  </Button>
                )}
                {gitHubHostname && (
                  <Button
                    key={'team-page'}
                    sx={
                      isOrgPage
                        ? {
                            my: 2,
                            color: 'white',
                            display: 'block',
                            fontWeight: 'bold',
                          }
                        : {
                            my: 2,
                            color: 'white',
                            display: 'block',
                          }
                    }
                  >
                    <NavLink
                      to={`/${gitHubHostname}/org`}
                      style={headerLinkStyle}
                    >
                      Team Dashboard
                    </NavLink>
                  </Button>
                )}
                {gitHubHostname && (
                  <Button
                    key={'repo-page'}
                    sx={
                      isRepoPage
                        ? {
                            my: 2,
                            color: 'white',
                            display: 'block',
                            fontWeight: 'bold',
                          }
                        : {
                            my: 2,
                            color: 'white',
                            display: 'block',
                          }
                    }
                  >
                    <NavLink
                      to={`/${gitHubHostname}/repo`}
                      style={headerLinkStyle}
                    >
                      Repository Dashboard
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
                      <NavLink to="new" style={linkStyle}>
                        Add GitHub server
                      </NavLink>
                    </Typography>
                  </MenuItem>
                  <MenuItem key={'manage'} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      <NavLink to="manage" style={linkStyle}>
                        Manage GitHub keys
                      </NavLink>
                    </Typography>
                  </MenuItem>

                  {gitHubTokens && gitHubTokens.length > 0 && <Divider />}

                  <MenuItem
                    key={`setting-divider`}
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center" sx={{ color: '#808080' }}>
                      Host Switcher
                    </Typography>
                  </MenuItem>

                  {gitHubTokens.map(({ hostname }) => (
                    <MenuItem
                      key={`setting-${hostname}`}
                      onClick={handleCloseUserMenu}
                    >
                      <Typography textAlign="center">
                        <NavLink
                          key={hostname}
                          to={hostname}
                          style={
                            hostname === gitHubHostname
                              ? selectedinkStyle
                              : linkStyle
                          }
                        >
                          {hostname}
                        </NavLink>
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </>
  );
};

export default GitHubServerNav;
