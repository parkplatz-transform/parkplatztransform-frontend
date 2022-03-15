import React, { useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

import { UserContext } from '../context/UserContext';
import mapState from '../state/MapState';
import segmentFormState from '../state/SegmentFormState';
import getString from '../../strings';
import theme from './MapTheme';
import modes from './MapModes';
import { routes } from '../../helpers/api';

const tileServerURL =
  'https://api.maptiler.com/maps/streets/style.json?key=kM1vIzKbGSB88heYLJqH';

function addStaticLayers(map) {
  map.addSource('clusters', {
    type: 'geojson',
    data: routes.clusters,
  });
  map.addLayer({
    id: 'clusters-fills',
    type: 'fill',
    source: 'clusters',
    paint: {
      'fill-color': '#3bb2d0',
      'fill-outline-color': '#3bb2d0',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.1,
      ],
    },
  });
  map.addLayer({
    id: 'clusters-borders',
    type: 'line',
    source: 'clusters',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#3bb2d0',
      'line-width': 1,
    },
  });
  map.addLayer({
    id: 'clusters-labels',
    type: 'symbol',
    source: 'clusters',
    layout: {
      'text-field': [
        'format',
        ['upcase', ['get', 'name']],
        { 'font-scale': 0.8 },
        '\n',
        {},
        ['downcase', ['get', 'label']],
        { 'font-scale': 0.6 },
      ],
    },
    paint: {
      'text-color': '#195b6b',
    },
  });
}

function hideStaticLayers(map) {
  map.setLayoutProperty('clusters-borders', 'visibility', 'none');
  map.setLayoutProperty('clusters-fills', 'visibility', 'none');
  map.setLayoutProperty('clusters-labels', 'visibility', 'none');

  map.setLayoutProperty('mapbox-gl-draw-hot', 'visibility', 'visible');
  map.setLayoutProperty('mapbox-gl-draw-cold', 'visibility', 'visible');
}

function showStaticLayers(map) {
  map.setLayoutProperty('clusters-borders', 'visibility', 'visible');
  map.setLayoutProperty('clusters-fills', 'visibility', 'visible');
  map.setLayoutProperty('clusters-labels', 'visibility', 'visible');

  map.setLayoutProperty('mapbox-gl-draw-hot', 'visibility', 'none');
  map.setLayoutProperty('mapbox-gl-draw-cold', 'visibility', 'none');
}

const PTMap = observer(({ mapState, onSegmentSelect }) => {
  const { user } = useContext(UserContext);
  const history = useHistory();
  const { lat, lng, zm } = useParams();
  const mapRef = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  useEffect(() => {
    if (!map.current) {
      setupMap();
    }
  }, []);

  useEffect(() => {
    map.current.on('draw.selectionchange', onSelect);
    if (user) { 
      map.current.on('draw.create', onCreate);
      map.current.on('draw.update', onUpdate);
      map.current.on('draw.delete', onDelete);
    }
    return () => {
      map.current.off('draw.selectionchange', onSelect);  
      map.current.off('draw.create', onCreate);
      map.current.off('draw.update', onUpdate);
      map.current.off('draw.delete', onDelete);
    }
  }, [user]);

  function setupMap() {
    map.current = new maplibregl.Map({
      container: mapRef.current,
      style: tileServerURL,
      center: [lng, lat],
      zoom: zm,
    });
    draw.current = new MapboxDraw({
      drawing: false,
      displayControlsDefault: false,
      userProperties: true,
      controls: {
        line_string: true,
        polygon: true,
        trash: true,
      },
      styles: theme,
      modes: modes,
    });

    map.current.addControl(draw.current, 'top-left');

    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'top-left'
    );

    map.current.on('load', onLoaded);
    map.current.on('zoomend', onMoveOrZoom);
    map.current.on('moveend', onMoveOrZoom);
    map.current.on('style.load', () => {
      addStaticLayers(map.current);
    });
  }

  function hasBasePermissions(owner_id) {
    return user.permission_level === 0 && owner_id !== user.id;
  }

  function onDelete(event) {
    event.features.forEach((feature) => {
      if (hasBasePermissions(feature.properties.owner_id)) {
        window.alert(getString('permissions_failure'));
      } else {
        mapState.onSegmentDeleted(feature.id);
      }
    });
  }

  async function onSelect(event) {
    // Assume it's a newly created segment if it has no properties and don't try to fetch it
    if (event?.features?.length > 0 && Object.keys(event?.features[0]?.properties).length > 0) {
      console.log(event.features[0])
      const updated = await onSegmentSelect(event.features[0]);
      if (updated) {
        draw.current.add(updated)
      }
    } else {
      onSegmentSelect(null);
    }
  }

  async function onCreate(event) {
    const newSegment = await mapState.onSegmentCreated(event.features[0]);
    draw.current.add(newSegment)
    draw.current.delete(event.features[0].id);
    draw.current.changeMode('simple_select', { featureIds: [newSegment.id] });
    const updated = await onSegmentSelect(newSegment);
    draw.current.add(updated)
  }

  function onUpdate(event) {
    event.features.forEach((feature) => {
      if (hasBasePermissions(feature.properties.owner_id)) {
        window.alert(getString('permissions_failure'));
      } else {
        mapState.onSegmentEdited(feature);
      }
    });
  }

  function onLoaded() {
    onMoveOrZoom();
  }

  function onMoveOrZoom() {
    const zm = map.current.getZoom();
    const { lat, lng } = map.current.getCenter();
    if (lat && lng && zm) {
      history.push(`/${lat}/${lng}/${zm}${window.location.search}`);
      if (zm >= 12) {
        hideStaticLayers(map.current);
        mapState.onBoundsChanged(map.current.getBounds(), draw.current);
      } else {
        showStaticLayers(map.current);
      }
    }
  }

  return <div style={{ height: '100%', width: '100%' }} ref={mapRef}></div>;
});

const connector = () => (
  <PTMap
    mapState={mapState}
    onSegmentSelect={action(async (currentSegment) => {
      return await segmentFormState.onSegmentSelect(currentSegment)
    })}
  />
);

export default connector;
