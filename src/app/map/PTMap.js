import React, { useEffect, useContext, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useParams, useHistory } from 'react-router-dom'
import 'leaflet-arrowheads'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import maplibregl from 'maplibre-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { UserContext } from '../context/UserContext'
import { SegmentContext } from '../context/SegmentContext'

const tileServerURL = 'https://api.maptiler.com/maps/streets/style.json?key=kM1vIzKbGSB88heYLJqH'
const attributtion = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'

function PTMap({ children }) {
  const history = useHistory()
  const { lat, lng, zm } = useParams()
  const mapRef = useRef(null)
  const map = useRef(null)
  const draw = useRef(null)
  const { 
    segments, 
    onBoundsChanged,
    onSegmentSelect,
    onSegmentDeleted,
    onSegmentCreated,
    onSegmentEdited,
    selectedSegmentId
  } = useContext(SegmentContext)

  useEffect(() => {
    if (!map.current) {
      setupMap()
    }
    if (map.current && draw.current && segments.length) {
      setFeatures()
    }
  }, [segments])

  function setupMap() {
    map.current = new maplibregl.Map({
      container: mapRef.current,
      style: tileServerURL,
      center: [lng, lat],
      zoom: zm
    });
    draw.current = new MapboxDraw()
    map.current.addControl(draw.current, 'top-right');

    map.current.addControl(draw, 'top-right');
    map.current.on('load', onLoaded)
    map.current.on('zoomend', onMoveOrZoom)
    map.current.on('moveend', onMoveOrZoom)
  }

  function onLoaded() {
    onBoundsChanged(map.current.getBounds())
    if (segments.length) {
      setFeatures()   
    }
  }

  function onMoveOrZoom() {
    const zm = map.current.getZoom()
    const { lat, lng } = map.current.getCenter()
      if (lat && lng && zm) {
        history.push(`/${lat}/${lng}/${zm}`)
        onBoundsChanged(map.current.getBounds())
      }
  }

  function setFeatures() {
    if (segments.length) {
      draw.current.deleteAll()
      draw.current.add({ features: segments, type: "FeatureCollection" })
    }
  }

  return (
    <>
    <div style={{ height: '100%' }} ref={mapRef}></div>
    </>
  )
}

export default PTMap