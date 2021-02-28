import React from 'react'

import './components.css'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import LoginForm from './LoginForm'
import { removeAuthCookie } from '../../helpers/auth'
import { getUserDataFromCookie } from '../../helpers/auth'
import TemporaryDrawer from './Drawer'
import { Link } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logoutButton: {
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  legalnotice: {
    marginLeft: 10,
    fontSize: 12,
  },
}))

function MainMenu() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [loginModalOpen, setLoginModalOpen] = React.useState(false)
  const userData = getUserDataFromCookie()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    removeAuthCookie()
    window.location.href = '/'
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <TemporaryDrawer />

        <LoginForm open={loginModalOpen} setOpen={setLoginModalOpen} />

        <Typography variant='h6' className={classes.title}>
          ParkplatzTransform
        </Typography>
        {!userData.loggedIn && (
          <Button color='inherit' onClick={() => setLoginModalOpen(true)}>
            Login
          </Button>
        )}

        {userData.loggedIn && userData.email}
        {userData.loggedIn && (
          <>
            <IconButton
              edge='start'
              className={classes.logoutButton}
              color='inherit'
              aria-label='menu'
              aria-controls='simple-menu'
              aria-haspopup='true'
              onClick={handleClick}
            >
              <ExitToAppIcon />
            </IconButton>
            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default MainMenu
