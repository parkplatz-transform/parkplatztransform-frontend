import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import theme from './MapTheme';
import modes from './MapModes';

const tileServerURL =
  'https://api.maptiler.com/maps/streets/style.json?key=kM1vIzKbGSB88heYLJqH';

class MapContext {
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
        this.map.addControl(new maplibregl.NavigationControl({
            visualizePitch: false,
            showZoom: true,
            showCompass: true
        }), 'top-left');
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

    addSegment(segment) {
      this.draw.add(segment)
    }
}

const mapContext = new MapContext()

export default mapContext