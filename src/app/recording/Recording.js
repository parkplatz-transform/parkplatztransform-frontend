import React, { useContext, useEffect, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import PTMap from '../map/PTMap'
import RightPanel from '../components/RightPanel'
import { SegmentContext } from '../context/SegmentContext'
import { Drawer } from '@material-ui/core'
import { UserContext } from '../context/UserContext'

const useStyles = makeStyles({
  buttonGroup: {
    marginTop: 10,
    textAlign: 'center'
  },
  bottomButton: {
    marginLeft: 5,
    marginRight: 5
  },
  container: {
    height: 'calc(100vh - 64px)',
    width: '100%',
    display: 'flex',
    overflow: 'hidden'
  },
  verticalSpace: {
    height: 30
  },
  mapArea: {
    width: '100%'
  },
  drawer: {
    top: '70px!important'
  }
})

function Recording () {
  const { user } = useContext(UserContext)
  const classes = useStyles()
  const { selectedSegmentId } = useContext(SegmentContext)
  const [open, setOpen] = useState(window.innerWidth > 900)

  const previousSegmentId = useRef(null)

  useEffect(() => {
    if (selectedSegmentId) {
      previousSegmentId.current = selectedSegmentId
    } if (previousSegmentId.current && !selectedSegmentId && open) {
      setOpen(false)
    } if (selectedSegmentId) {
      setOpen(true)
    }
  }, [selectedSegmentId])

  return (
    <>
      <div className={classes.container}>
        <div
          className={clsx(classes.mapArea, user ? null : 'logged-out')}
        >
          <PTMap key="map"/>
        </div>
        
        <Drawer 
          variant="persistent" 
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
        >
          <RightPanel/>  
        </Drawer>
      </div>
    </>
  )
}

export default Recording
