import React, { useContext, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import { useMapEvents } from 'react-leaflet'
import { useHistory } from 'react-router-dom'
import 'leaflet-arrowheads'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

import getString from '../../strings'
import { UserContext } from '../context/UserContext'
import { SegmentContext } from '../context/SegmentContext'
import PTGeometry from './PTGeometry'


export function MapController() {
  const history = useHistory()
  const user = useContext(UserContext)
  const { 
    segments, 
    onBoundsChanged,
    onSegmentSelect,
    onSegmentDeleted,
    onSegmentCreated,
    onSegmentEdited,
    selectedSegmentId
  } = useContext(SegmentContext)
  
  // Position Controller
  const map = useMapEvents({
    'pm:create': async ({ layer }) => {
      await onSegmentCreated(layer.toGeoJSON())
      layer.remove() // since once the server's response comes back it will be rendered over the top
    },
    moveend: (event) => {
      const { lat, lng } = event.target.getCenter()
      const zm = event.target.getZoom()

      if (lat && lng && zm) {
        history.push(`/${lat}/${lng}/${zm}`)
        onBoundsChanged(event.target.getBounds())
      }
    }
  })
  
  useEffect(() => {
    onBoundsChanged(map.getBounds())
  }, [map, onBoundsChanged])


  return segments.map(segment => {
    function setLineWeight() {
      if (map._zoom <= 14) {
        return '1'
      }
      if (map._zoom === 18) {
        return '7'
      }
      return '4'
    }
    return <PTGeometry
      key={segment.id}
      lineWeight={setLineWeight()}
      type={segment.geometry.type}
      eventHandlers={{
        'pm:edit': (event) => {
          if (user.permission_level === 0 && segment.properties.owner_id !== user.id) {
            onSegmentEdited({ ...segment, geometry: segment.geometry })
          } else {
            // Need to merge the old segment with new geometry
            onSegmentEdited({ ...segment, geometry: event.layer.toGeoJSON().geometry })
          }
        },
        'pm:remove': async (event) => {
          if (user.permission_level === 0 && segment.properties.owner_id !== user.id) {
            window.alert(getString('permissions_failure'))
            map.addLayer(event.layer)
          } else {
            const confirmDelete = window.confirm(getString('segment_delete_confirm'))
            if (confirmDelete) {
              await onSegmentDeleted(segment.id)
            } else {
              // Add the layer back
              map.addLayer(event.layer)
            }
          }
        },
        click: (event) => {
          if (!map.pm._globalRemovalMode) {
            onSegmentSelect(segment.id)
          }
        }
      }}
      isSelected={segment.id === selectedSegmentId}
      hasSubsegments={segment.properties.has_subsegments}
      coordinates={segment.geometry.coordinates} 
    />
  })
}