import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import PTMap from '../map/PTMap'
import RightPanel from '../components/RightPanel'
import { SegmentContext } from '../context/SegmentContext'
import { DownloadSegmentsButton } from '../components/DownloadButton'
import { Drawer } from '@material-ui/core'

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
  const { selectedSegmentId } = useContext(SegmentContext)

  return (
    <>
      <div className={classes.container}>
        <div 
          className={classes.mapArea}
        >
            <PTMap key="map">
              <DownloadSegmentsButton />
            </PTMap>
        </div>
        
        <Drawer 
          variant="persistent" 
          anchor="right"
          open={!!selectedSegmentId}
          onClose={() => {}}
        >
          <RightPanel/>  
        </Drawer>
      </div>
    </>
  )
}

export default Recording
