import React, { useEffect, useRef } from 'react'
import  L from 'leaflet'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { geoJsonFromSegments } from '../../helpers/geojson'

import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

const tileServerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attributtion = 'copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

const DEFAULT_MAP_POSITION = {
  lat: 52.501389, // Center of Berlin
  lng: 13.402500,
  zm: 10
}

function MapController({ segments, onBoundsChanged, onSegmentSelect, onSegmentDeleted, onSegmentEdited }) {
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
        //console.log(layerRef.current)
        if (layerRef.current && layerRef.current.clearLayers) {
            //console.log('CLEARING LAYERS')
            layerRef.current.clearLayers()
            //map.removeLayer(layerRef.current)
        }
        // Update the reference layer
        layerRef.current = L.geoJSON(geoJsonFromSegments(segments))
        // Add it to the map
        //console.log('ADDING LAYERS TO MAP', geoJsonFromSegments(segments))
        layerRef.current.addTo(map)
        // Bind click listeners for each layer / feature
        layerRef.current.eachLayer(layer => {
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

function PTMap({ segments, onBoundsChanged, onSegmentSelect, onSegmentCreated, onSegmentDeleted, onSegmentEdited }) {
    const { lat = DEFAULT_MAP_POSITION.lat, lng = DEFAULT_MAP_POSITION.lng, zm = DEFAULT_MAP_POSITION.zm } = useParams();

    return (
        <>
        <MapContainer
            center={[lat, lng]}
            zoom={zm}
            scrollWheelZoom={true}
            whenReady={(map) => {
                onBoundsChanged(map.target.getBounds())
                configureGeoman(map.target.pm)
                // Setup geoman handlers
                map.target.on('pm:create', async ({ layer }) => {
                    await onSegmentCreated(layer.toGeoJSON())
                    layer.remove() // Important to remove this, since once the server's response comes back it will be rendered over the top
                });
            }}
        >
            <MapController
                onBoundsChanged={onBoundsChanged}
                segments={segments}
                onSegmentSelect={onSegmentSelect}
                onSegmentDeleted={onSegmentDeleted}
                onSegmentEdited={onSegmentEdited}
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