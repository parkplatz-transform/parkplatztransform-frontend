import MapboxDraw from '@mapbox/mapbox-gl-draw';

var StaticMode = {};

StaticMode.onSetup = function () {
  this.setActionableState(); // default actionable state is false for all actions
  return {};
};

StaticMode.toDisplayFeatures = function (state, geojson, display) {
  display(geojson);
};

var modes = MapboxDraw.modes;
modes.static = StaticMode;

export default modes