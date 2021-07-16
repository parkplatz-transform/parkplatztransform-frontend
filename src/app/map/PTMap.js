import React from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, Polygon, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { useHistory, useParams } from 'react-router-dom'
import * as turf from '@turf/turf'
import 'leaflet-arrowheads'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import SplitButton from '../components/SplitButton'
import getString from '../../strings'
import { makeStyles } from '@material-ui/core'

const tileServerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attributtion = 'copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

const DOWNLOAD_FILENAME = 'parkplatz-transform.json'

const SELECTED_SEGMENT_COLOR = '#f00' // https://github.com/geoman-io/leaflet-geoman/issues/751
const UNSELECTED_EMPTY_SEGMENT_COLOR = 'purple'
const UNSELECTED_SEGMENT_COLOR = '#3388ff'

const useStyles = makeStyles({
  downloadButton: {
    zIndex: 1000,
    position: 'fixed',
    left: 10,
    bottom: 10
  }
})

export function DownloadSegmentsButton({ segments }) {
  const classes = useStyles()
  const map = useMap()

  function bboxToLeafletBounds(bbox) {
    const corner1 = L.latLng(bbox[1], bbox[0])
    const corner2 = L.latLng(bbox[3], bbox[2])
    return L.latLngBounds(corner1, corner2)
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

  function downloadAllSegments() {
    downloadSegments(segments)
  }

  function downloadVisibleSegments() {
    const visibleSegments = segments.filter(segment => map.getBounds().intersects(bboxToLeafletBounds(segment.bbox)))
    downloadSegments(visibleSegments)
  }

  function segmentsAreInBounds() {
    return segments.some(segment =>
      map.getBounds().intersects(bboxToLeafletBounds(segment.bbox))
    )
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

export function MapController({
  segments,
  onBoundsChanged,
  onSegmentSelect,
  onSegmentDeleted,
  onSegmentCreated,
  onSegmentEdited,
  selectedSegmentId
}) {
  const history = useHistory()

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

  function setLineWeight() {
    const zm = map._zoom
    if (zm <= 14) {
      return '1'
    }
    if (zm === 18) {
      return '7'
    }
    return '4'
  }

  function setSegmentStyle(segment) {
    const styles = {
      color: UNSELECTED_SEGMENT_COLOR,
      weight: setLineWeight(),
      lineJoin: 'square',
    }
    if (segment.id === selectedSegmentId) {
      styles.color = SELECTED_SEGMENT_COLOR
    } else if (!segment.properties?.has_subsegments) {
      styles.color = UNSELECTED_EMPTY_SEGMENT_COLOR
    }
    return styles
  }

  return segments.map(segment => {
    if (segment.geometry.type === 'LineString') {
      const line = turf.lineString(segment.geometry.coordinates)
      const length = turf.length(line, { units: 'meters' })
      return <Polyline
        pathOptions={setSegmentStyle(segment)}
        key={segment.id}
        ref={(el) => {
          if (el && selectedSegmentId && (segment.id === selectedSegmentId)) {
            el.arrowheads({
              color: SELECTED_SEGMENT_COLOR,
              frequency: 'endonly',
              size: '5%',
              yawn: 80,
            })
          } else if (el) {
            el.deleteArrowheads()
          }
        }}
        eventHandlers={{
          'pm:edit': (event) => {
            // Need to merge the old segment with new geometry
            onSegmentEdited({ ...segment, geometry: event.layer.toGeoJSON().geometry })
          },
          'pm:remove': async (event) => {
            const confirmDelete = window.confirm(getString('segment_delete_confirm'))
            if (confirmDelete) {
              await onSegmentDeleted(segment.id)
            } else {
              // Add the layer back
              map.addLayer(event.layer)
            }
          },
          click: (event) => {
            if (!map.pm._globalRemovalMode) {
              onSegmentSelect(segment.id)
            }
          }
        }}
        positions={segment.geometry.coordinates.map(([lat, lng]) => [lng, lat])}>
        <Tooltip>
          Länge: {Math.round(length + Number.EPSILON)} m
        </Tooltip>
      </Polyline>
    } else if (segment.geometry.type === 'Polygon') {
      return <Polygon
        pathOptions={setSegmentStyle(segment)}
        key={segment.id}
        eventHandlers={{
          'pm:edit': (event) => {
            // Need to merge the old segment with new geometry
            onSegmentEdited({ ...segment, geometry: event.layer.toGeoJSON().geometry })
          },
          'pm:remove': async (event) => {
            const confirmDelete = window.confirm(getString('segment_delete_confirm'))
            if (confirmDelete) {
              await onSegmentDeleted(segment.id)
            } else {
              // Add the layer back
              map.addLayer(event.layer)
            }
          },
          click: (event) => {
            if (!map.pm._globalRemovalMode) {
              onSegmentSelect(segment.id)
            }
          }
        }}
        positions={segment.geometry.coordinates[0].map(([lat, lng]) => [lng, lat])}>
      </Polygon>

    }
  })
}

function configureGeoman(map) {
  map.setLang('de')
  map.setGlobalOptions({
    // allowSelfIntersection: false, <-- I don't know why this causes issues.
    removeLayerBelowMinVertexCount: false,
    snappable: false
  })
  map.addControls({
    position: 'topright',
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: true,
    drawRectangle: false,
    drawPolygon: true,
    editMode: true,
    dragMode: false,
    cutPolygon: false,
    drawCircle: false,
  })
}

function PTMap({ onBoundsChanged, children }) {
  const { lat, lng, zm } = useParams()

  return (
    <>
      <MapContainer
        center={[lat, lng]}
        zoom={zm}
        style={{ position: 'static' }}
        scrollWheelZoom={true}
        whenReady={(map) => {
          onBoundsChanged(map.target.getBounds())
          configureGeoman(map.target.pm)
        }}
      >
        <TileLayer
          attribution={attributtion}
          url={tileServerURL}
        />
        {children}
      </MapContainer>
    </>
  )
}

export default PTMap
