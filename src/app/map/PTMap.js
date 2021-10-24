import React, { useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import maplibregl from 'maplibre-gl';
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import { UserContext } from '../context/UserContext'
import { SegmentContext } from '../context/SegmentContext'
import getString from '../../strings'

const tileServerURL = 'https://api.maptiler.com/maps/streets/style.json?key=kM1vIzKbGSB88heYLJqH'

function PTMap({ children }) {
  const user = useContext(UserContext)
  const history = useHistory()
  const { lat, lng, zm } = useParams()
  const mapRef = useRef(null)
  const map = useRef(null)
  const draw = useRef(null)
  const segId = useRef(null)
  
  const { 
    segments, 
    onBoundsChanged,
    onSegmentSelect,
    onSegmentDeleted,
    onSegmentCreated,
    onSegmentEdited,
  } = useContext(SegmentContext)
  
  useEffect(() => {
    if (!map.current) {
      setupMap()
    }
    if (map.current && draw.current && segments.length) {
      setFeatures()
    }
  }, [segments])

  useEffect(() => {
    map.current.on('draw.selectionchange', onSelect);
    if (user) {
      map.current.on('draw.create', onCreate);
      map.current.on('draw.delete', onDelete);
      map.current.on('draw.update', onUpdate);
    }
  }, [user])

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

  function hasBasePermissions(owner_id) {
    return user.permission_level === 0 
      && owner_id !== user.id
  }

  function onDelete(event) {
    event.features.forEach((feature) => {
      if (hasBasePermissions(feature.properties.owner_id)) {
        window.alert(getString('permissions_failure'))
      } else {
        onSegmentDeleted(feature.id)
      }
    });
  }

  function onSelect(event) {
    if (event.features.length) {
      segId.current = event.features[0].id
      onSegmentSelect(event.features[0].id)
    } else {
      history.push(`/${lat}/${lng}/${zm}`)
      segId.current = null
    }
  }

  function onCreate(event) {
    event.features.forEach((feature) => {
      onSegmentCreated(feature)
    });
  }

  function onUpdate(event) {
    event.features.forEach((feature) => {
      if (hasBasePermissions(feature.properties.owner_id)) {
        window.alert(getString('permissions_failure'))
      } else {
        onSegmentEdited(feature)
      }
    });
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
    if (lat && lng && zm && segId.current) {
        history.push(`/${lat}/${lng}/${zm}/${segId.current}`)
        onBoundsChanged(map.current.getBounds())
    } else if (lat && lng && zm) {
        history.push(`/${lat}/${lng}/${zm}`)
        onBoundsChanged(map.current.getBounds())
      }
  }

  function setFeatures() {
    if (segments.length) {
      draw.current.add({ features: segments, type: "FeatureCollection" })
    }
  }

  return <div style={{ height: '100%', width: '100%' }} ref={mapRef}></div>
}

export default PTMap