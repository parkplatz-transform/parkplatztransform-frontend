import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import PTMap from '../map/PTMap'
import RightPanel from '../components/RightPanel'
import { SegmentProvider } from '../context/SegmentContext'
import { MapController } from '../map/MapController'
import { DownloadSegmentsButton } from '../components/DownloadButton'
import { Drawer } from '@material-ui/core'
import MainMenu from '../components/MainMenu'

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
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <>
    <SegmentProvider>
      <div className={classes.container}>
        <div className={classes.mapArea} style={{ width: drawerOpen ? 'calc(100% - 360px)' : '100%' }}>
            <PTMap key="map">
              <DownloadSegmentsButton />
            </PTMap>
        </div>
        
        <Drawer 
          variant="permanent" 
          anchor='right'
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <RightPanel/>  
        </Drawer>
      </div>
      </SegmentProvider>
    </>
  )
}

export default React.memo(Recording)
