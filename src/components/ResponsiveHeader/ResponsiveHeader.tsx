import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {
  AccountCircle,
  Menu as MenuIcon,
} from '@material-ui/icons';
import { FC, useContext, useEffect, useState } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import {
  LoginIconStyled,
  UserAvatarWrapperStyled,
} from './ResponsiveHeader.styles';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from 'App';
import { IAppContext } from 'types';
import { pages, settings } from './config';

const ResponsiveHeader: FC = () => {
  const [anchorElNav, setAnchorElNav] =
    useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] =
    useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const { isAuth, setIsAuth } = useContext(
    AppContext,
  ) as IAppContext;
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('userData');
    if (user) {
      const userParsed = JSON.parse(user);
      setUsername(userParsed.username);
    }
  }, []);

  const handleOpenNavMenu = (
    event: React.MouseEvent<HTMLElement | null>,
  ) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (
    event: React.MouseEvent<HTMLElement | null>,
  ) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (data: string) => {
    setAnchorElUser(null);
    if (data === settings[0]) {
      navigate('/profile');
    }

    if (data === settings[1]) {
      setIsAuth(false);
      localStorage.removeItem('userData');
      navigate('/');
    }
  };

  const loginHandler = () => {
    navigate('/auth');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
            }}
            style={{ cursor: 'default' }}
          >
            EDA
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <Link to={page[1]} key={uuidv4()}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      style={{ cursor: 'pointer' }}
                    >
                      {page[0]}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
            }}
            style={{ cursor: 'default' }}
          >
            EDA
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {pages.map((page) => (
              <Link to={page[1]} key={uuidv4()}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                  }}
                >
                  {page[0]}
                </Button>
              </Link>
            ))}
          </Box>

          {isAuth ? (
            <UserAvatarWrapperStyled>
              {/* <div>{username}</div> */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                  >
                    <AccountCircle
                      fontSize="large"
                      style={{ color: 'white' }}
                    />
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
                  {settings.map((setting) => (
                    <MenuItem
                      key={uuidv4()}
                      onClick={() =>
                        handleCloseUserMenu(setting)
                      }
                    >
                      <Typography textAlign="center">
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </UserAvatarWrapperStyled>
          ) : (
            <IconButton
              aria-label="log in"
              style={{
                color: 'white',
              }}
              onClick={loginHandler}
            >
              <LoginIconStyled>
                <LoginIcon />
              </LoginIconStyled>
            </IconButton>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveHeader;
