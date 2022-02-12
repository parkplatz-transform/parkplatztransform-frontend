import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CloudDownload from '@material-ui/icons/CloudDownload'
import Code from '@material-ui/icons/Code'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'

import { getAllSegments } from '../../helpers/api'

const DOWNLOAD_FILENAME = 'parkplatz-transform.json'

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
    maxWidth: '20px',
    marginRight: '10px'
  },
  paddingLeft: {
    paddingLeft: '0.25rem',
  },
})

export default React.memo(() => {
  const classes = useStyles()
  const [state, setState] = React.useState(false)

  async function downloadAllSegments() {
    const allSegments = await getAllSegments()
    const element = document.createElement('a')
    element.href = window.URL.createObjectURL(new Blob([JSON.stringify(allSegments)]))
    element.download = DOWNLOAD_FILENAME
    element.style.display = 'none'
    element.click()
  }

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
          <ListItem button onClick={downloadAllSegments}>
            <CloudDownload className={classes.icon} />
            <ListItemText className={classes.paddingLeft} primary={"GeoJSON herunterladen"} />
          </ListItem>
          <a key={'docs'} className={classes.link} href={'https://api.xtransform.org/docs'}>
          <ListItem button onClick={downloadAllSegments}>
            <Code className={classes.icon} />
            <ListItemText className={classes.paddingLeft} primary={"API Documentation"} />
          </ListItem>
          </a>
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
})
