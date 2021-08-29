import React from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import 'leaflet-arrowheads'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'

const tileServerURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attributtion = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

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

function PTMap({ children }) {
  const { lat, lng, zm } = useParams()

  return (
    <>
      <MapContainer
        preferCanvas={true}
        center={[lat, lng]}
        zoom={zm}
        style={{ position: 'static' }}
        scrollWheelZoom={true}
        whenReady={(map) => {
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

export default React.memo(PTMap)
