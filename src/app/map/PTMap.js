import React, { useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

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
    if (map.current && draw.current) {
      setFeatures()
    }
  }, [segments])

  useEffect(() => {
    map.current.on('draw.selectionchange', onSelect);
    if (user) {
      map.current.on('draw.create', onCreate);
      map.current.on('draw.update', onUpdate);
      map.current.on('draw.delete', onDelete);
    }
  }, [user])

  function setupMap() {
    map.current = new window.maplibregl.Map({
      container: mapRef.current,
      style: tileServerURL,
      center: [lng, lat],
      zoom: zm
    });
    draw.current = new MapboxDraw({
      drawing: false,
      displayControlsDefault: false,
      controls: {
        line_string: true,
        polygon: true,
        trash: true
      },
    })
    map.current.addControl(draw.current, 'top-left');

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
    if (event?.features?.length > 0 && event?.features[0]?.id) {
      segId.current = event.features[0].id
      onSegmentSelect(event.features[0].id)
    } else {
      segId.current = null
      onSegmentSelect(null)
    }
  }

  async function onCreate(event) {
    const newSeg = await onSegmentCreated(event.features[0])
    draw.current.delete(event.features[0].id)
    draw.current.changeMode('simple_select', { featureIds: [newSeg.id] })
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
    // onBoundsChanged(map.current.getBounds())
    onMoveOrZoom()
    if (segments.length) {
      setFeatures()
    }
  }

  function onMoveOrZoom() {
    const zm = map.current.getZoom()
    const { lat, lng } = map.current.getCenter()
    if (lat && lng && zm) {
        history.push(`/${lat}/${lng}/${zm}`)
        if (!map.current.getSource('kiez-geojson')) {
          map.current.addSource('kiez-geojson', {
            type: 'geojson',
            data: '/berlin_ortsteile.geojson'
          });
        }
        if (zm >= 13) {
          if (map.current.getLayer('kiez-borders')) {
            map.current.removeLayer('kiez-borders')
            map.current.removeLayer('kiez-fill')
          }
          onBoundsChanged(map.current.getBounds())
        } else {
          draw.current.deleteAll()
          if (!map.current.getLayer('kiez-borders')) {
            map.current.addLayer({
              'id': 'kiez-fill',
              'type': 'fill',
              'source': 'kiez-geojson',
              'paint': {
                'fill-color': '#3bb2d0',
                'fill-outline-color': '#3bb2d0',
                'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.1
                  ]
              }
            });
            map.current.addLayer({
              'id': 'kiez-borders',
              'type': 'line',
              'source': 'kiez-geojson',
              'layout': {
                'line-join': 'round',
                'line-cap': 'round'
              },
              'paint': {
                'line-color': '#3bb2d0',
                'line-width': 1
              }
              });
              // map.current.addLayer({
              //   "id": "clusters-label",
              //   "type": "symbol",
              //   "source": "kiez",
              //   "layout": {
              //     "text-field": "2000 parkplatz",
              //     "text-font": [
              //       "DIN Offc Pro Medium",
              //       "Arial Unicode MS Bold"
              //     ],
              //     "text-size": 12
              //   }
              // });
          }
      }

      }
  }

  function setFeatures() {
      draw.current.set({ 
        features: segments, 
        type: 'FeatureCollection',
        id: 'ppt-feature-collection',
      })
  }

  return <div style={{ height: '100%', width: '100%' }} ref={mapRef}></div>
}

export default PTMap