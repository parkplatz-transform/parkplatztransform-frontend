import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core'

import SplitButton from '../components/SplitButton'
import getString from '../../strings'
import { SegmentContext } from '../context/SegmentContext'
import { getAllSegments } from '../../helpers/api'

const DOWNLOAD_FILENAME = 'parkplatz-transform.json'

const useStyles = makeStyles({
  downloadButton: {
    zIndex: 1000,
    position: 'fixed',
    left: 10,
    bottom: 10
  }
})
export function DownloadSegmentsButton() {
  const classes = useStyles()
  // const map = useMap()

  const { segments } = useContext(SegmentContext)

  function bboxToLeafletBounds(bbox) {
    // const corner1 = L.latLng(bbox[1], bbox[0])
    // const corner2 = L.latLng(bbox[3], bbox[2])
    // return L.latLngBounds(corner1, corner2)
  }

  function downloadSegments(_segments) {
    const data = {
      'type': 'FeatureCollection',
      'features': _segments,
    }

    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, '    ')))
    element.setAttribute('download', DOWNLOAD_FILENAME)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  async function downloadAllSegments() {
    const allSegments = await getAllSegments()  
    downloadSegments(allSegments)
  }

  function downloadVisibleSegments() {
    // const visibleSegments = segments.filter(segment => map.getBounds().intersects(bboxToLeafletBounds(segment.bbox)))
    // downloadSegments(visibleSegments)
  }

  function segmentsAreInBounds() {
    // return segments.some(segment =>
    //   map.getBounds().intersects(bboxToLeafletBounds(segment.bbox))
    // )
  }

  return (
    <div className={classes.downloadButton}>
      <SplitButton optionsAndCallbacks={[
        { label: getString('download_geo_json') },
        {
          label: getString('download_visible_segments'),
          disabled: !segmentsAreInBounds(),
          callback: downloadVisibleSegments
        },
        { label: getString('download_all_segments'), disabled: segments.length === 0, callback: downloadAllSegments },
      ]} />
    </div>
  )
}