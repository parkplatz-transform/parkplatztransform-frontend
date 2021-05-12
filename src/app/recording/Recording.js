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
    height: '100%',
    width: '100%',
    display: 'flex'
  },
  verticalSpace: {
    height: 30
  },
  mapArea: {
    width: 'calc(100% - 360px)'
  },
  formArea: {
    width: 360,
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
  const [isLoading, setIsLoading] = useState(true)

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

  async function onBoundsChange (bounds) {
    const boundingBox = {
      swLng: bounds._southWest.lng,
      swLat: bounds._southWest.lat,
      neLng: bounds._northEast.lng,
      neLat: bounds._northEast.lat,
    }

    if (checkIfBoundingBoxWasRequestedBefore(boundingBox)) {
      return
    }

    const topRight = `${boundingBox.neLng},${boundingBox.neLat}`
    const bottomRight = `${boundingBox.swLng},${boundingBox.neLat}`
    const bottomLeft = `${boundingBox.swLng},${boundingBox.swLat}`
    const topLeft = `${boundingBox.neLng},${boundingBox.swLat}`

    const modifiedAfter = getYoungestModifiedDateOfSegmentsInBounds(boundingBox)
    const boundingBoxString = `${topRight},${bottomRight},${bottomLeft},${topLeft},${topRight}`
    loadedBoundingBoxesRef.current.push(boundingBox)
    try {
      setIsLoading(true)
      const geoJson = await getSegments(boundingBoxString, modifiedAfter)
      addSegments(geoJson.features)
      setIsLoading(false)
      setAlertDisplayed({severity: 'success', message: getString('segment_loaded_success')})
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_loaded_failure')})
      setIsLoading(false)
      loadedBoundingBoxesRef.current = loadedBoundingBoxesRef.current.filter(bbox => bbox !== boundingBox)
    }
  }

  async function onSegmentEdited (updatedSegment) {
    setSelectedSegmentId(null)
    addSegments([updatedSegment])
    try {
      setAlertDisplayed({severity: 'success', message: getString('segment_update_success')})
      await updateSegment(updatedSegment)
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_update_failure')})
    }
  }

  async function onSegmentSelect (id) {
    setSelectedSegmentId(id)
    const segment = segmentsById[id]
    if (segment && (!segment?.properties?.subsegments || segment.properties.subsegments.length === 0)) {
      setIsLoading(true)
      const segmentWithDetails = await getSegment(id)
      addSegment(segmentWithDetails)
      setSelectedSegmentId(segmentWithDetails.id)
      setIsLoading(false)
    }
  }

  function checkIfBoundingBoxWasRequestedBefore (boundingBox) {
    return loadedBoundingBoxesRef.current.some(bbox => bboxContainsBBox(bbox, boundingBox))
  }

  function getYoungestModifiedDateOfSegmentsInBounds (boundingBox) {
    return Object.values(segmentsById)
      .filter(segment => {
        if (segment.bbox) {
          const swLng = segment.bbox[0]
          const swLat = segment.bbox[1]
          const neLng = segment.bbox[2]
          const neLat = segment.bbox[3]
          return bboxIntersectsBBox(boundingBox, {swLng, swLat, neLng, neLat})
        }
        return false
      })
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
        <div className={classes.formArea}>
          <RightPanel
            isLoading={isLoading}
            segment={segmentsById[selectedSegmentId]}
            onSegmentChanged={onSegmentChanged}
            setAlertDisplayed={setAlertDisplayed}
            onSegmentClose={() => setSelectedSegmentId(null)}
          />
        </div>
      </div>
    </>
  )
}

export default Recording
