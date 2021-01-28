import React, { useState, useRef } from 'react'
import PTMap from '../map/PTMap'
import { emptyBoundsArray } from './TypeSupport'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Alert from '@material-ui/lab/Alert'
import { getSegment, getSegments, postSegment, updateSegment, deleteSegment } from '../../helpers/api'
import { bboxContainsBBox, bboxIntersectsBBox } from '../../helpers/geocalc'
import SegmentForm from '../components/SegmentForm'
import { Snackbar } from '@material-ui/core'
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
  header: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 20
  },
  subheader: {
    margin: '20px auto',
    textAlign: 'center',
    fontEeight: 'bold',
    fontSize: 16
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

  /*
   * As far as I can tell the react-leaflet-draw event listeners only get bound on initial mounting of the components,
   * so they're all set to the initial segment state of `{}` leading to all kinds of weird bugs.
   * I've used a Ref bellow to keep track of up to date segment values, when reading from segmentsById use segmentsByIdRef instead.
   * */
  const [segmentsById, setSegmentsById] = useState({})
  const [alertDisplayed, setAlertDisplayed] = useState(null)
  const segmentsByIdRef = useRef({})
  segmentsByIdRef.current = segmentsById

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
      console.log('was requested before')
      return
    }

    const topRight = `${boundingBox.neLng},${boundingBox.neLat}`
    const bottomRight = `${boundingBox.swLng},${boundingBox.neLat}`
    const bottomLeft = `${boundingBox.swLng},${boundingBox.swLat}`
    const topLeft = `${boundingBox.neLng},${boundingBox.swLat}`

    const knownSegmentIdsInBounds = getLoadedSegmentIdsInBounds(boundingBox)
    const boundingBoxString = `${topRight},${bottomRight},${bottomLeft},${topLeft},${topRight}`
    loadedBoundingBoxesRef.current.push(boundingBox)
    try {
      setIsLoading(true)
      const geoJson = await getSegments(boundingBoxString, knownSegmentIdsInBounds)
      addSegments(geoJson.features)
      setIsLoading(false)
      setAlertDisplayed({severity: 'success', message: getString('segment_loaded_success')})
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_loaded_failure')})
      setIsLoading(false)
      loadedBoundingBoxesRef.current = loadedBoundingBoxesRef.current.filter(bbox => bbox !== boundingBox)
    }
  }

  async function onSegmentEdited (changedGeojson) {
    setSelectedSegmentId(null)
    addSegments(changedGeojson?.features)

    const promises = changedGeojson?.features.map(async segment => {
      return await updateSegment(segment)
    })

    try {
      const updatedSegments = await Promise.all(promises)
      addSegments(updatedSegments)
      setAlertDisplayed({severity: 'success', message: getString('segment_update_success')})
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_update_failure')})
    }
  }

  async function onSegmentSelect (id) {
    console.log('selected segment id', id)

    setSelectedSegmentId(id)

    const segment = segmentsById[id]
    if (segment && (!segment.properties || segment.properties.length === 0)) {
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
    }).map(segment => segment.id)
  }

  function addSegment (newOrUpdatedSegment) {
    addSegments([newOrUpdatedSegment])
  }

  function addSegments (newOrUpdatedSegments) {
    const newSegmentsById = Object.assign({}, segmentsByIdRef.current)
    for (const segment of newOrUpdatedSegments) {
      newSegmentsById[segment.id] = segment
    }

    console.log('from', newOrUpdatedSegments, 'to', newSegmentsById)

    setSegmentsById(newSegmentsById)
  }

  /**
   * returns a sanitized copy or null if has invalid configurations
   */
  function sanitizeSegment (segment) {
    const copy = JSON.parse(JSON.stringify(segment))

    for (const subsegment of copy.properties.subsegments) {
      if (subsegment.parking_allowed === null) {
        return null
      }
      if (subsegment.parking_allowed === true) {
        // TODO: remove all settings related to parking_allowed === false

      } else {
        // TODO: remove all settings related to parking_allowed === true

      }
    }
    return copy
  }

  async function onSegmentChanged (segment) {
    try {
      const sanitizedSegment = sanitizeSegment(segment)

      if (!sanitizedSegment) {
        setAlertDisplayed({severity: 'error', message: getString('subsegment_invalid')})
      }

      const updatedSegment = await updateSegment(segment)
      addSegment(updatedSegment)
      setAlertDisplayed({severity: 'success', message: getString('segment_update_success', sanitizedSegment.id)})
      return true
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_update_failure')})
      return false
    }
  }

  function onSegmentsDeleted (ids) {
    const newSegmentsById = Object.assign({}, segmentsByIdRef.current)
    const deletes = ids.map(async id => {
      delete newSegmentsById[id]
      await deleteSegment(id)
    })
    setSegmentsById(newSegmentsById)

    try {
      setAlertDisplayed({severity: 'success', message: getString('segment_delete_success', deletes.length)})
      return Promise.all(deletes)
    } catch (e) {
      setAlertDisplayed({severity: 'error', message: getString('segment_delete_failure', deletes.length)})
      return Promise.reject(e)
    }
  }

  function renderMapView () {
    return (
      <div>
        <PTMap
          key='map'
          selectedSegmentId={selectedSegmentId}
          onSegmentSelect={onSegmentSelect}
          onSegmentEdited={onSegmentEdited}
          onSegmentCreated={onSegmentCreated}
          onSegmentsDeleted={onSegmentsDeleted}
          onBoundsChanged={onBoundsChange}
          segments={Object.values(segmentsById)}
        />
      </div>
    )
  }

  function renderFormView () {
    if (isLoading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress/>
        </div>
      )
    }
    if (!selectedSegmentId) {
      return (
        <div>
          <div className={classes.verticalSpace}/>
          <div className={classes.header}>{getString('welcome_title')}</div>
          <div className={classes.subheader}>{getString('welcome_subtitle')}</div>
          <div className={classes.subheader}>{getString('welcome_subtitle_2')}</div>
        </div>

      )
    }
    return <SegmentForm segment={segmentsById[selectedSegmentId]} onChanged={onSegmentChanged}/>
  }

  function renderSnackBar () {
    return (
      <Snackbar
        open={!!alertDisplayed}
        autoHideDuration={3000}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        onClose={() => setAlertDisplayed(null)}
      >
        <Alert severity={alertDisplayed?.severity}>{alertDisplayed?.message}</Alert>
      </Snackbar>
    )
  }

  return (
    <>
      {renderSnackBar()}
      <div className={classes.container}>
        <div className={classes.mapArea}>
          {renderMapView()}
        </div>

        <div className={classes.formArea}>
          {renderFormView()}
        </div>

      </div>
    </>
  )
}

export default Recording
