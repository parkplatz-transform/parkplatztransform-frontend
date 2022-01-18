import React, { useEffect, useContext, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import { UserContext } from '../context/UserContext'
import { SegmentContext } from '../context/SegmentContext'
import getString from '../../strings'
import theme from './MapTheme'
import { routes } from '../../helpers/api'

const tileServerURL = 'https://api.maptiler.com/maps/streets/style.json?key=kM1vIzKbGSB88heYLJqH'

var StaticMode = {};

StaticMode.onSetup = function() {
  this.setActionableState(); // default actionable state is false for all actions
  return {};
};

StaticMode.toDisplayFeatures = function(state, geojson, display) {
  display(geojson);
};

function addStaticLayers(map) {
  map.addSource('clusters', {
    type: 'geojson',
    data: routes.clusters
  });
  map.addLayer({
    'id': 'clusters-fills',
    'type': 'fill',
    'source': 'clusters',
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
  map.addLayer({
    'id': 'clusters-borders',
    'type': 'line',
    'source': 'clusters',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#3bb2d0',
      'line-width': 1
    }
  });
  map.addLayer({
    "id": "clusters-labels",
    "type": "symbol",
    "source": "clusters",
    "layout": {
      'text-field': [
        'format',
        ['upcase', ['get', 'name']],
        { 'font-scale': 0.8 },
        '\n',
        {},
        ['downcase', ['get', 'label']],
        { 'font-scale': 0.6 }
      ],
    },
    paint: {
      "text-color": "#195b6b"
    }
  });
}

function hideStaticLayers(map) {
  map.setLayoutProperty('clusters-borders', 'visibility', 'none');
  map.setLayoutProperty('clusters-fills', 'visibility', 'none');
  map.setLayoutProperty('clusters-labels', 'visibility', 'none');
}

function showStaticLayers(map) {
  map.setLayoutProperty('clusters-borders', 'visibility', 'visible');
  map.setLayoutProperty('clusters-fills', 'visibility', 'visible');
  map.setLayoutProperty('clusters-labels', 'visibility', 'visible');
}


function PTMap({ children }) {
  const { user } = useContext(UserContext)
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
  
  var modes = MapboxDraw.modes;
  modes.static = StaticMode;
  
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
      styles: theme,
      modes: modes
    })

    map.current.addControl(draw.current, 'top-left');

    map.current.on('load', onLoaded)
    map.current.on('zoomend', onMoveOrZoom)
    map.current.on('moveend', onMoveOrZoom)
    map.current.on('style.load', () => {
      addStaticLayers(map.current)
    })
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
      history.push(`/${lat}/${lng}/${zm}${window.location.search}`)
      if (zm >= 12) {
        hideStaticLayers(map.current)
        onBoundsChanged(map.current.getBounds())
      } else {
        draw.current.deleteAll()
        showStaticLayers(map.current)
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