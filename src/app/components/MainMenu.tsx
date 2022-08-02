import React, { useContext } from 'react';

import './components.css';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from 'react-router-dom';

import LoginForm from './LoginForm';
import TemporaryDrawer from './Drawer';
import { Avatar, Typography } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import blue from '@material-ui/core/colors/blue';
import { observer } from 'mobx-react-lite';

import { UserContext } from '../context/UserContext';
import appState, { AppState } from '../state/AppState';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  userButton: {
    marginLeft: 'auto',
  },
  title: {
    flexGrow: 1,
  },
  titleLink: {
    color: 'white',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  legalnotice: {
    marginLeft: 10,
    fontSize: 12,
  },
}));

const MainMenu = observer(({ appState }: { appState: AppState }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const { user, logout } = useContext(UserContext);

  const handleClick = (event: Event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggleRightDrawer = () => {
    appState.setRightDrawerOpen(!appState.rightDrawerOpen);
  };

  return (
    <AppBar position="relative" style={{ zIndex: 1201 }}>
      <Toolbar>
        <TemporaryDrawer />

        <LoginForm open={loginModalOpen} setOpen={setLoginModalOpen} />

        <Typography variant="body1" className={classes.title}>
          <Link className={classes.titleLink} to="/" color="inherit">
            ParkplatzTransform
          </Link>
        </Typography>

        {!user && (
          <Button
            className={classes.userButton}
            color="inherit"
            onClick={() => setLoginModalOpen(true)}
          >
            Login
          </Button>
        )}

        {user && (
          <>
            <IconButton
              edge="end"
              className={classes.userButton}
              color="inherit"
              aria-label="menu"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={(event: Event) => handleClick(event)}
            >
              <Avatar style={{ backgroundColor: blue[500] }}>
                {user?.email[0]}
              </Avatar>
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </>
        )}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleToggleRightDrawer}
        >
          <EditIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
});

const connector = () => <MainMenu appState={appState} />;

export default connector;
