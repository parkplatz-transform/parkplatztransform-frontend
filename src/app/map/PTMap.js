import React, { useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import { UserContext } from '../context/UserContext'
import { SegmentContext } from '../context/SegmentContext'
import getString from '../../strings'

const tileServerURL = 'https://api.maptiler.com/maps/streets/style.json?key=kM1vIzKbGSB88heYLJqH'

const theme = [
  {
    'id': 'gl-draw-polygon-fill-inactive',
    'type': 'fill',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'fill-color': '#3bb2d0',
      'fill-outline-color': '#3bb2d0',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-fill-active',
    'type': 'fill',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#fbb03b',
      'fill-outline-color': '#fbb03b',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Polygon'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#3bb2d0',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-active',
    'type': 'line',
    'filter': ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-inactive',
    'type': 'line',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'LineString'],
      ['!=', 'mode', 'static']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': [
        'case',
        ['boolean',['get', 'user_has_subsegments'], false],
        '#3bb2d0',
        'purple'
      ],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-active',
    'type': 'line',
    'filter': ['all',
      ['==', '$type', 'LineString'],
      ['==', 'active', 'true']
    ],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#fbb03b',
      'line-dasharray': [0.2, 2],
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-polygon-and-line-vertex-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-point-point-stroke-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 5,
      'circle-opacity': 1,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-inactive',
    'type': 'circle',
    'filter': ['all',
      ['==', 'active', 'false'],
      ['==', '$type', 'Point'],
      ['==', 'meta', 'feature'],
      ['!=', 'mode', 'static']
    ],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#3bb2d0'
    }
  },
  {
    'id': 'gl-draw-point-stroke-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'active', 'true'],
      ['!=', 'meta', 'midpoint']
    ],
    'paint': {
      'circle-radius': 7,
      'circle-color': '#fff'
    }
  },
  {
    'id': 'gl-draw-point-active',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['!=', 'meta', 'midpoint'],
      ['==', 'active', 'true']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fbb03b'
    }
  },
  {
    'id': 'gl-draw-polygon-fill-static',
    'type': 'fill',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'paint': {
      'fill-color': '#404040',
      'fill-outline-color': '#404040',
      'fill-opacity': 0.1
    }
  },
  {
    'id': 'gl-draw-polygon-stroke-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-line-static',
    'type': 'line',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
    'layout': {
      'line-cap': 'round',
      'line-join': 'round'
    },
    'paint': {
      'line-color': '#404040',
      'line-width': 2
    }
  },
  {
    'id': 'gl-draw-point-static',
    'type': 'circle',
    'filter': ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
    'paint': {
      'circle-radius': 5,
      'circle-color': '#404040'
    }
  }
]

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
      userProperties: true,
      controls: {
        line_string: true,
        polygon: true,
        trash: true
      },
      styles: theme
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