import React, { useEffect, useRef } from 'react'
import  L from 'leaflet'
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useParams, useHistory } from 'react-router-dom'
import { geoJsonFromSegments } from '../../helpers/geojson'

import 'leaflet-arrowheads'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import SplitButton from '../components/SplitButton'
import getString from '../../strings'
import { makeStyles } from '@material-ui/core'

const tileServerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attributtion = 'copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

const DOWNLOAD_FILENAME = 'parkplatz-transform.json'

const SELECTED_SEGMENT_COLOR = 'red'
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

function DownloadSegmentsButton({ segments }) {
    const classes = useStyles()
    const map = useMap()

    function bboxToLeafletBounds(bbox) {
        const corner1 = L.latLng(bbox[0], bbox[1])
        const corner2 = L.latLng(bbox[2], bbox[3])
        const bounds = L.latLngBounds(corner1, corner2);
        return bounds
    }

    function downloadSegments (_segments) {
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
        const visible = segments.filter(segment =>
            map.getBounds().intersects(bboxToLeafletBounds(segment.bbox))
        )
        downloadSegments(visible)
    }

    function segmentsAreInBounds() {
        return segments.some(segment =>
            map.getBounds().intersects(bboxToLeafletBounds(segment.bbox))
        )
    }

    return (
      <div className={classes.downloadButton}>
        <SplitButton optionsAndCallbacks={[
          {label: getString('download_geo_json')},
          {
            label: getString('download_visible_segments'),
            disabled: segmentsAreInBounds(),
            callback: downloadVisibleSegments
          },
          {label: getString('download_all_segments'), disabled: segments.length === 0, callback: downloadAllSegments},
        ]}/>
      </div>
    )
}

// Headless controller component
export function MapController({ segments, onBoundsChanged, onSegmentSelect, onSegmentDeleted, onSegmentEdited, selectedSegmentId }) {
    const layerRef = useRef()
    const history = useHistory()

    // Position Controller
    const map = useMapEvents({
        moveend: (event) => {
            const {lat, lng} = event.target.getCenter()
            const zm = event.target.getZoom()

            if (lat && lng && zm) {
                history.push(`/${lat}/${lng}/${zm}`)
                onBoundsChanged(event.target.getBounds())
            }
        }
    })

    // GeoJSON Controller
    useEffect(() => {
        // If the layer exists, clear it to avoid multiple layers
        if (layerRef.current && layerRef.current.clearLayers) {
            layerRef.current.clearLayers()
        }
        // Update the reference layer
        layerRef.current = L.geoJSON(geoJsonFromSegments(segments))
        // Add it to the map
        layerRef.current.addTo(map)
        // Bind click listeners for each layer / feature
        layerRef.current.eachLayer(layer => {
            const isSelected = !!selectedSegmentId && (layer.feature.id === selectedSegmentId)
            let color
            if (isSelected) {
                color = SELECTED_SEGMENT_COLOR
            }
            else if (layer.feature.properties.subsegments.length === 0) {
                color = UNSELECTED_EMPTY_SEGMENT_COLOR
            }
            else {
                color = UNSELECTED_SEGMENT_COLOR
            }
            layer.setStyle({
                color,
                weight: '4',
                lineJoin: 'square'
            })
            if (isSelected) {
                layer.arrowheads({ size: '8px', fill: true, frequency: 'endonly' })
            }
            layer.on('pm:edit',() => {
                onSegmentEdited(layer.toGeoJSON())
            })
            layer.on('click', () => {
                if (map.pm._globalRemovalMode) {
                    onSegmentDeleted(layer.feature.id)
                } else {
                    onSegmentSelect(layer.feature.id)
                }
            })
        })
    })

    return null
}

function configureGeoman(map) {
    //map.setLang('de');
    map.setGlobalOptions({
        allowSelfIntersection: false,
        removeLayerBelowMinVertexCount: false,
        snapping: false
    })
    map.addControls({
        position: 'topright',
        drawMarker: false,
        drawCircleMarker: false,
        drawPolyline: true,
        drawRectangle: false,
        drawPolygon: false,
        editMode: true,
        dragMode: false,
        cutPolygon: false,
        drawCircle: false,
    });
}

function PTMap({ segments, onBoundsChanged, onSegmentSelect, onSegmentCreated, onSegmentDeleted, onSegmentEdited, selectedSegmentId }) {
    const { lat, lng, zm } = useParams();

    return (
        <>
            <MapContainer
                center={[lat, lng]}
                zoom={zm}
                style={{position: 'static'}}
                scrollWheelZoom={true}
                whenReady={(map) => {
                    onBoundsChanged(map.target.getBounds())
                    configureGeoman(map.target.pm)
                    // Setup geoman handlers
                    map.target.on('pm:create', async ({ layer }) => {
                        await onSegmentCreated(layer.toGeoJSON())
                        layer.remove() // Remove this, since once the server's response comes back it will be rendered over the top
                    });
                }}
            >
            <DownloadSegmentsButton
                segments={segments}
            />
            <MapController
                onBoundsChanged={onBoundsChanged}
                segments={segments}
                onSegmentSelect={onSegmentSelect}
                onSegmentDeleted={onSegmentDeleted}
                onSegmentEdited={onSegmentEdited}
                selectedSegmentId={selectedSegmentId}
            />
            <TileLayer
                attribution={attributtion}
                url={tileServerURL}
            />
            </MapContainer>
        </>
    )
}

export default PTMap