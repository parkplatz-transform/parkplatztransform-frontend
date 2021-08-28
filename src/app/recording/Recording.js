import React, { useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import { Snackbar } from '@material-ui/core'

import PTMap, { DownloadSegmentsButton, MapController } from '../map/PTMap'
import { emptyBoundsArray } from './TypeSupport'
import { deleteSegment, getSegment, getSegments, postSegment, updateSegment } from '../../helpers/api'
import RightPanel from '../components/RightPanel'
import { sanitizeSegment } from './Segment'
import { bboxContainsBBox, bboxIntersectsBBox } from '../../helpers/geocalc'
import getString from '../../strings'
import { PermissionsError } from '../../helpers/errors'

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

  const [segmentsById, setSegmentsById] = useState({})
  const [alertDisplayed, setAlertDisplayed] = useState(null)

  const [selectedSegmentId, setSelectedSegmentId] = useState(null)

  const loadedBoundingBoxesRef = useRef(emptyBoundsArray())

  async function onSegmentCreated (segment) {
    try {
      const createdSegment = await postSegment({...segment, properties: {subsegments: []}})
      addSegment(createdSegment)
      setSelectedSegmentId(createdSegment.id)
      setAlertDisplayed({severity: 'success', message: getString('segment_create_success', createdSegment.id)})
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_create_failure')})
    }
  }

  async function onSegmentEdited (updatedSegment) {
    setSelectedSegmentId(null)
    addSegments([updatedSegment])
    try {
      setAlertDisplayed({severity: 'success', message: getString('segment_update_success')})
      await updateSegment(updatedSegment)
    } catch (e) {
      if (e instanceof PermissionsError) {
        setAlertDisplayed({severity: 'error', message: getString('permissions_failure')})
      } else {
        setAlertDisplayed({severity: 'error', message: getString('segment_update_failure')})
      }
    }
  }

  async function onSegmentSelect (id) {
    setSelectedSegmentId(id)
    const segmentWithDetails = await getSegment(id)
    addSegment(segmentWithDetails)
    setSelectedSegmentId(segmentWithDetails.id)
  }

  async function onBoundsChange (bounds) {
    // be less precise with map bounds and load larger chunks, avoid re-fetch on every little map move
    // rounding precision depends on how big the requested area is
    const boundingBox = {
      swLng: Math.floor(bounds._southWest.lng * 100) / 100,
      swLat: Math.floor(bounds._southWest.lat * 100) / 100,
      neLng: Math.ceil(bounds._northEast.lng * 100) / 100,
      neLat: Math.ceil(bounds._northEast.lat * 100) / 100
    }

    if (checkIfBoundingBoxWasRequestedBefore(boundingBox)) {
      return
    }

    const topRight = `${boundingBox.neLng},${boundingBox.neLat}`
    const bottomRight = `${boundingBox.swLng},${boundingBox.neLat}`
    const bottomLeft = `${boundingBox.swLng},${boundingBox.swLat}`
    const topLeft = `${boundingBox.neLng},${boundingBox.swLat}`

    const loadedSegments = getLoadedSegmentIdsInBounds(boundingBox)
    const excludedIds = loadedSegments.map(segment => segment.id)
    const latestModificationDate = getLatestModificationDate(loadedSegments)
    const boundingBoxString = `${topRight},${bottomRight},${bottomLeft},${topLeft},${topRight}`
    loadedBoundingBoxesRef.current.push(boundingBox)
    try {
      const geoJson = await getSegments(boundingBoxString, excludedIds, latestModificationDate)
      addSegments(geoJson.features)
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_loaded_failure')})
      loadedBoundingBoxesRef.current = loadedBoundingBoxesRef.current.filter(bbox => bbox !== boundingBox)
    }
  }

  function checkIfBoundingBoxWasRequestedBefore (boundingBox) {
    return loadedBoundingBoxesRef.current.some(bbox => bboxContainsBBox(bbox, boundingBox))
  }

  function getLoadedSegmentIdsInBounds (boundingBox) {
    return Object.values(segmentsById).filter(segment => {
      if (segment.bbox) {
        const swLng = segment.bbox[0]
        const swLat = segment.bbox[1]
        const neLng = segment.bbox[2]
        const neLat = segment.bbox[3]
        return bboxIntersectsBBox(boundingBox, {swLng, swLat, neLng, neLat})
      }
      return false
    })
  }

  function getLatestModificationDate (segments) {
    return segments
      .map(segment => segment.properties?.modified_at)
      .filter(Boolean)
      .sort()
      .reverse()[0]
  }

  function addSegment (newOrUpdatedSegment) {
    addSegments([newOrUpdatedSegment])
  }

  function addSegments (newOrUpdatedSegments) {
    const newSegmentsById = Object.assign({}, segmentsById)
    for (const segment of newOrUpdatedSegments) {
      newSegmentsById[segment.id] = segment
    }

    setSegmentsById(newSegmentsById)
  }

  async function onSegmentChanged (segment) {
    try {
      const sanitizedSegment = sanitizeSegment(segment)

      if (!sanitizedSegment) {
        setAlertDisplayed({severity: 'error', message: getString('subsegment_invalid')})
      }

      const updatedSegment = await updateSegment(sanitizedSegment)
      addSegment(updatedSegment)
      console.log('Client set:')
      console.table(segment.properties.subsegments)
      console.log('Server returned:')
      console.table(updatedSegment.properties.subsegments)
      setAlertDisplayed({severity: 'success', message: getString('segment_update_success', sanitizedSegment.id)})
      return true
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_update_failure')})
      return false
    }
  }

  async function onSegmentDeleted (id) {
    const newSegmentsById = Object.assign({}, segmentsById)

    try {
      setAlertDisplayed({severity: 'success', message: getString('segment_delete_success', 1)})
      await deleteSegment(id)
      delete newSegmentsById[id]
      await setSegmentsById(newSegmentsById)
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_delete_failure', 1)})
      return Promise.reject(e)
    }
  }

  return (
    <>
      <Snackbar
        open={!!alertDisplayed}
        autoHideDuration={3000}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={() => setAlertDisplayed(null)}
      >
        <Alert severity={alertDisplayed?.severity}>{alertDisplayed?.message}</Alert>
      </Snackbar>
      <div className={classes.container}>
        <div className={classes.mapArea}>
          <PTMap
            key="map"
            onBoundsChanged={onBoundsChange}
          >
            <MapController
              onBoundsChanged={onBoundsChange}
              segments={Object.values(segmentsById)}
              onSegmentSelect={onSegmentSelect}
              onSegmentDeleted={onSegmentDeleted}
              onSegmentEdited={onSegmentEdited}
              onSegmentCreated={onSegmentCreated}
              selectedSegmentId={selectedSegmentId}
            />
            <DownloadSegmentsButton
              segments={Object.values(segmentsById)}
            />
          </PTMap>
        </div>
        <RightPanel
          segment={segmentsById[selectedSegmentId]}
          onSegmentChanged={onSegmentChanged}
          setAlertDisplayed={setAlertDisplayed}
        />
      </div>
    </>
  )
}

export default Recording
