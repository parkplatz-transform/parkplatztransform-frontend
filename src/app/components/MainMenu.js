import React, { useContext } from 'react'

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
import { Link } from '@material-ui/core'

import LoginForm from './LoginForm'
import { UserContext } from '../context/UserContext'
import { removeAuthCookie } from '../../helpers/auth'

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
    fontSize: 12
  }
}))

function MainMenu() {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [loginModalOpen, setLoginModalOpen] = React.useState(false)
  const user = useContext(UserContext)

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
        <LoginForm open={loginModalOpen} setOpen={setLoginModalOpen} />

        <Typography variant='h6' className={classes.title}>
          ParkplatzTransform
          <Link className={classes.legalnotice} target="_blank" href="https://www.xtransform.org/impressum.html" color="inherit">
            Impressum
          </Link>
        </Typography>
        {!user && (
          <Button color='inherit' onClick={() => setLoginModalOpen(true)}>
            Login
          </Button>
        )}

        {user && user.email}
        {user && (
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
