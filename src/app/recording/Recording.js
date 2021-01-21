import React, { useState, useRef } from 'react'
import PTMap from '../map/PTMap'
import { emptyBoundsArray } from './TypeSupport'
import { makeStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import Alert from '@material-ui/lab/Alert'
import { getSegment, getSegments, postSegment, updateSegment, deleteSegment } from '../../helpers/api'
import { bboxContainsBBox, bboxIntersectsBBox } from '../../helpers/geocalc'
import SegmentForm from '../components/SegmentForm'
import {Snackbar} from '@material-ui/core'

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
  const segmentsByIdRef = useRef({});
  segmentsByIdRef.current = segmentsById

  const [selectedSegmentId, setSelectedSegmentId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadedBoundingBoxesRef = useRef(emptyBoundsArray())

  async function onSegmentCreated (segment) {
    try {
      const createdSegment = await postSegment({...segment, properties: {subsegments: []}})
      addSegment(createdSegment)
      setSelectedSegmentId(createdSegment.id)
      setAlertDisplayed({ severity: 'success', message: `Successfully created segment with id: ${createdSegment.id}` })
    } catch (e) {
      setAlertDisplayed({ severity: 'error', message: 'Failed to create segement' })
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
      setAlertDisplayed({ severity: 'success', message: 'Successfully loaded all segments.' })
    } catch (e) {
      setAlertDisplayed({ severity: 'error', message: 'Problem loading all segments.' })
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
      await Promise.all(promises)
      setAlertDisplayed({ severity: 'success', message: 'Successfully updated segment(s)' })
    } catch (e) {
      setAlertDisplayed({ severity: 'error', message: 'Failed to update segement(s)' })
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

  async function onSegmentChanged (segment) {
    try {
      await updateSegment(segment)
      setAlertDisplayed({ severity: 'success', message: `Successfully updated segment with id: ${segment.id}` })
    } catch (e) {
      setAlertDisplayed({ severity: 'error', message: 'Failed to update segement.' })
    }
  }
  
  function onSegmentsDeleted(ids) {
    const newSegmentsById = Object.assign({}, segmentsByIdRef.current)
    const deletes = ids.map(async id => {
      delete newSegmentsById[id]
      await deleteSegment(id)
    })
    setSegmentsById(newSegmentsById)
    
    try {
      setAlertDisplayed({ severity: 'success', message: `Successfully deleted ${deletes.length} segments.` })
      return Promise.all(deletes)
    } catch (e) {
      setAlertDisplayed({ severity: 'error', message: `Failed to delete ${deletes.length} segments` })
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
          <div className={classes.header}>Willkommen bei ParkplatzTransport</div>
          <div className={classes.subheader}>Wähle einen vorhandenen Abschnitt oder erstelle einen Neuen</div>
          <div className={classes.subheader}>Zoome in die Karte um die Bearbeitungswerkzeuge zu sehen</div>
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
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
