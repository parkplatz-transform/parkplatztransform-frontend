import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import List from '@material-ui/core/List'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  link: {
    fontSize: '1.2rem',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  icon: {
    fill: 'rgba(0, 0, 0, 0.4)',
  },
  paddingLeft: {
    paddingLeft: '0.25rem',
  },
})

export default function TemporaryDrawer() {
  const classes = useStyles()
  const [state, setState] = React.useState(false)

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setState(!state)
  }

  const list = () => (
    <div
      className={clsx(classes.list)}
      role='presentation'
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Home', 'Howto', 'Impressum', 'Datenschutz'].map((text, index) => (
          <Link key={`${text}-${index}`} className={classes.link} to={`/${text.toLowerCase()}`}>
            <ListItem button>
              <ArrowForwardIcon className={classes.icon} />
              <ListItemText className={classes.paddingLeft} primary={text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  )

  return (
    <div>
      <React.Fragment key='left'>
        <IconButton
          className={classes.menuButton}
          color='inherit'
          onClick={toggleDrawer(true)}
        >
          {' '}
          <MenuIcon />
        </IconButton>
        <Drawer anchor='left' open={state} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  )
}
