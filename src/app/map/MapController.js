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

class MapController {
    setupMap(lat, lng, zm) {
        this.map = new maplibregl.Map({
          container: 'map',
          style: tileServerURL,
          center: [lng, lat],
          zoom: zm,
        });
        this.draw = new MapboxDraw({
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
        this.map.addControl(this.draw, 'top-left');
        this.map.addControl(
          new maplibregl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
          }),
          'top-left'
        );
    }
}

const mapController = new MapController()

export default mapController