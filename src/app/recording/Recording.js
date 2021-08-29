import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import PTMap from '../map/PTMap'
import RightPanel from '../components/RightPanel'
import { SegmentProvider } from '../context/SegmentContext'
import { MapController } from '../map/MapController'
import { DownloadSegmentsButton } from '../components/DownloadButton'

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
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
})

function Recording () {
  const classes = useStyles()

  return (
    <>
    <SegmentProvider>
      <div className={classes.container}>
        <div className={classes.mapArea}>
            <PTMap key="map">
              <MapController />
              <DownloadSegmentsButton />
            </PTMap>
        </div>
        <RightPanel/>
      </div>
      </SegmentProvider>
    </>
  )
}

export default React.memo(Recording)
