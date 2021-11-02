import React, { useState, createContext, useRef, useEffect } from 'react'

import { emptyBoundsArray } from '../recording/TypeSupport'
import { deleteSegment, getSegment, getSegments, postSegment, updateSegment, ws } from '../../helpers/api'
import { sanitizeSegment } from '../recording/Segment'
import { bboxContainsBBox, bboxIntersectsBBox } from '../../helpers/geocalc'
import getString from '../../strings'
import { PermissionsError } from '../../helpers/errors'
import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

export const SegmentContext = createContext({
  segments: [],
  onBoundsChanged: () => {}
})

export function SegmentProvider({ children }) {
  const [segmentsById, setSegmentsById] = useState({})
  const [alertDisplayed, setAlertDisplayed] = useState(null)

  const [selectedSegmentId, setSelectedSegmentId] = useState(null)

  const loadedBoundingBoxesRef = useRef(emptyBoundsArray())

  useEffect(() => {
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      addSegments(data.features)
    }
  }, [])
  
  async function onSegmentCreated (segment) {
    try {
      const createdSegment = await postSegment({...segment, properties: {subsegments: []}})
      addSegment(createdSegment)
      setSelectedSegmentId(createdSegment.id)
    } catch (e) {
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
    if (id === null) {
      setSelectedSegmentId(null)
      return
    }
    if (id === selectedSegmentId) { return }
    setSelectedSegmentId(id)
    const segmentWithDetails = await getSegment(id)
    addSegment(segmentWithDetails)
    setSelectedSegmentId(segmentWithDetails.id)
  }
  
  async function onBoundsChanged (bounds) {
    // be less precise with map bounds and load larger chunks, avoid re-fetch on every little map move
    // rounding precision depends on how big the requested area is
    
    const boundingBox = {
      swLng: Math.floor(bounds._sw.lng * 100) / 100,
      swLat: Math.floor(bounds._sw.lat * 100) / 100,
      neLng: Math.ceil(bounds._ne.lng * 100) / 100,
      neLat: Math.ceil(bounds._ne.lat * 100) / 100
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
      getSegments(boundingBoxString, excludedIds, latestModificationDate)
      // if (geoJson.features && geoJson.features.length) {
      //   addSegments(geoJson.features)
      // }
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
      setSegmentsById(newSegmentsById)
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
    <SegmentContext.Provider 
      value={{ 
        segments: Object.values(segmentsById),
        segment: segmentsById[selectedSegmentId],
        alertDisplayed,
        setAlertDisplayed,
        onBoundsChanged,
        onSegmentSelect,
        onSegmentDeleted,
        onSegmentCreated,
        onSegmentEdited,
        onSegmentChanged,
        selectedSegmentId
      }}>
      {children}
    </SegmentContext.Provider>
    </>
  )
}