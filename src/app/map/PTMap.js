import React, { useEffect, useContext, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { action } from 'mobx';

import { UserContext } from '../context/UserContext';
import mapState from '../state/MapState';
import segmentFormState from '../state/SegmentFormState';
import getString from '../../strings';
import mapContext from './MapContext'
import { routes } from '../../helpers/api';


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

  useEffect(() => {
    if (!mapContext.map) {
      setupMap();
    }
  }, []);

  useEffect(() => {
    if (!user) {
      mapContext.draw.changeMode('static');
    } else {
      mapContext.draw.changeMode('simple_select');
    }
  }, [user])

  useEffect(() => {
    mapContext.map.on('draw.selectionchange', onSelect);
    if (user) { 
      mapContext.map.on('draw.create', onCreate);
      mapContext.map.on('draw.update', onUpdate);
      mapContext.map.on('draw.delete', onDelete);
    }
    return () => {
      mapContext.map.off('draw.selectionchange', onSelect);  
      mapContext.map.off('draw.create', onCreate);
      mapContext.map.off('draw.update', onUpdate);
      mapContext.map.off('draw.delete', onDelete);
    }
  }, [user]);

  function setupMap() {
    mapContext.setupMap(lat, lng, zm)

    mapContext.map.on('load', onLoaded);
    mapContext.map.on('zoomend', onMoveOrZoom);
    mapContext.map.on('moveend', onMoveOrZoom);
    mapContext.map.on('style.load', () => {
      addStaticLayers(mapContext.map);
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
        mapContext.draw.add(updated)
      }
    } else {
      onSegmentSelect(null);
    }
  }

  async function onCreate(event) {
    const newSegment = await mapState.onSegmentCreated(event.features[0]);
    mapContext.draw.add(newSegment)
    mapContext.draw.delete(event.features[0].id);
    mapContext.draw.changeMode('simple_select', { featureIds: [newSegment.id] });
    const updated = await onSegmentSelect(newSegment);
    mapContext.draw.add(updated)
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
    const zm = mapContext.map.getZoom();
    const { lat, lng } = mapContext.map.getCenter();
    if (lat && lng && zm) {
      history.push(`/${lat}/${lng}/${zm}${window.location.search}`);
      if (zm >= 12) {
        hideStaticLayers(mapContext.map);
        mapState.onBoundsChanged(mapContext.map.getBounds());
      } else {
        showStaticLayers(mapContext.map);
      }
    }
  }

  return <div id="map" style={{ height: '100%', width: '100%' }} ref={mapRef}></div>;
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
