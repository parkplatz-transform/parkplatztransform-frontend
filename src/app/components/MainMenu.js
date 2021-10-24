import React, { useContext } from 'react'

import './components.css'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import LoginForm from './LoginForm'
import TemporaryDrawer from './Drawer'
import { Avatar, Typography } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'

import { UserContext } from '../context/UserContext'
import { logoutUser } from '../../helpers/api'
import { Link } from 'react-router-dom'

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

  const handleLogout = async () => {
    await logoutUser()
  }

  return (
    <AppBar position='relative' style={{ zIndex: 1201 }}>
      <Toolbar>
        <TemporaryDrawer />

        <LoginForm open={loginModalOpen} setOpen={setLoginModalOpen} />

        <Typography variant='h6' className={classes.title}>
          <Link className={classes.titleLink} href='/' color='inherit'>
            ParkplatzTransform
          </Link>
        </Typography>

        {!user && (
          <Button className={classes.userButton} color='inherit' onClick={() => setLoginModalOpen(true)}>
            Login
          </Button>
        )}
        
        {user && (
          <>
            <IconButton
              edge='end'
              className={classes.userButton}
              color='inherit'
              aria-label='menu'
              aria-controls='simple-menu'
              aria-haspopup='true'
              onClick={handleClick}
            >
              <Avatar style={{ backgroundColor: blue[500] }}>{user?.email[0]}</Avatar>
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
