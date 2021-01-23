/**
 * Map taken and changed from here: https://github.com/alex3165/react-leaflet-draw/blob/HEAD/example/edit-control.js
 *
 * TODO: localize language: https://stackoverflow.com/a/53401594
 */

import React, { useEffect, useRef, useState } from 'react'
import { FeatureGroup, Map, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { EditControl } from 'react-leaflet-draw'
import { geoJsonFromSegments } from '../../helpers/geojson'
import { persistMapPosition, loadMapPosition } from '../../helpers/position-persistence'

// Leaflet plugins
import 'leaflet-arrowheads'
import { makeStyles } from '@material-ui/core/styles'
import SplitButton from '../components/SplitButton'
// work around broken icons when using webpack, see https://github.com/PaulLeCam/react-leaflet/issues/255

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.0/images/marker-shadow.png',
})

const MAP_HEIGHT = 'calc(100vh - 64px)'  // fullscreen - app bar height
const MIN_ZOOM_FOR_EDITING = 16
const DOWNLOAD_FILENAME = 'parkplatz-transform.json'

const SELECTED_FEATURE_COLOR = 'red' // ⚠️
const UNSELECTED_FEATURE_COLOR = '#3388ff'  // default blue



const useStyles = makeStyles({
  downloadButton: {
    zIndex: 1000,
    position: 'absolute',
    left: 10,
    bottom: 10
  }
})

export default function PTMap ({
                                 segments,
                                 onSegmentSelect,
                                 selectedSegmentId,
                                 onSegmentEdited,
                                 onSegmentCreated,
                                 onSegmentsDeleted,
                                 onBoundsChanged
                               }) {

  const [showEditControl, setShowEditControl] = useState(false)
  const [deleteModeEnabled, setDeleteModeEnabled] = useState(false)
  const visibleSegmentsRef = useRef([])
  const editableFGRef = useRef(null)
  let position = loadMapPosition();

  const classes = useStyles()

  useEffect(() => {
    setFeaturesFromSegments()
  }, [segments, setFeaturesFromSegments])

  // see http://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw-event for leaflet-draw events doc

  function _onEdited (e) {
    _onChange(true)
  }

  function _onCreated (e) {
    _onChange()
  }

  async function _onDeleted (e) {
    const layers = e.layers._layers
    const idsToDelete = Object.keys(layers)
      .filter(key => !!layers[key]?.feature && layers[key]?.feature?.id)
      .map(key => layers[key]?.feature?.id)

    await onSegmentsDeleted(idsToDelete)
    setDeleteModeEnabled(false)
  }

  function _onMounted (drawControl) {
    onBoundsChanged(drawControl._map.getBounds())
  }

  function _onMoveEnd (e) {
    setShowEditControl(e.sourceTarget._zoom >= MIN_ZOOM_FOR_EDITING)
    setFeaturesFromSegments()
    onBoundsChanged(e.sourceTarget.getBounds())
    const leafletFG = editableFGRef.current.leafletElement
    const {lat, lng} = leafletFG._map.getCenter()
    const zoom = leafletFG._map.getZoom()

    if (lat && lng && zoom) {
      persistMapPosition({ lat, lng, zoom })
    }
  }

  function _onDrawStart (e, f) {
    console.log('on draw start', e)
    console.log('on draw start2', f)
    _onChange()
  }

  function _onDrawStop (e) {
    // user finished drawing
    console.log('on draw stop', e)

    const geojsonData = editableFGRef.current.leafletElement.toGeoJSON()
    const newFeature = geojsonData.features[geojsonData.features.length - 1]
    console.log('newFeature', newFeature)
    onSegmentCreated(newFeature)

  }

  function _onEditStop (e) {
  }

  function _onFeatureGroupReady (reactFGref) {

    if (!reactFGref) {
      // happens on leaving PTMap
      return
    }

    // store the ref for future access to content
    editableFGRef.current = reactFGref

    setFeaturesFromSegments()
  }

  function _onChange (notify = false) {
    // editableFGRef.current contains the edited geometry, which can be manipulated through the leaflet API
    if (!editableFGRef.current) {
      return
    }

    if (notify) {
      const geojsonData = editableFGRef.current.leafletElement.toGeoJSON()
      console.log('geojson', geojsonData)
      onSegmentEdited(geojsonData)
    }
  }

  /**
   * TODO: In order to make editing lines work again, this function must not be doing anything
   *       after editing / drawing started.
   *       Also, getDrawOptions and getEditOptions must be stable during editing / drawing for not losing the tools
   *       on zoom change.
   */
  function setFeaturesFromSegments () {
    visibleSegmentsRef.current = []
    if (editableFGRef.current == null) {
      // not yet ready
      return
    }

    const leafletGeojson = new L.GeoJSON(geoJsonFromSegments(segments))

    // populate the leaflet FeatureGroup with the initialGeoJson layers
    const leafletFG = editableFGRef.current.leafletElement
    leafletFG.clearLayers()

    leafletGeojson.eachLayer(layer => {
      const isSelected = selectedSegmentId === layer.feature.id
      const color = isSelected
        ? SELECTED_FEATURE_COLOR
        : UNSELECTED_FEATURE_COLOR
      layer.setStyle({color, lineJoin: 'square'})
      const isInBounds = leafletFG._map.getBounds().isValid() && leafletFG._map.getBounds().intersects(layer.getBounds())

      if (isInBounds) {
        visibleSegmentsRef.current.push(layer.toGeoJSON())

        // add a marker for start and end if selected
        if (isSelected) {
          layer.arrowheads({size: '8px', fill: true, frequency: 'endonly'})
        }
        leafletFG.addLayer(layer)
        layer.off('click')
        layer.on('click', function (event) {
          if (!deleteModeEnabled) {
            onSegmentSelect(layer.feature.id)
          }
        })
      }
    })
  }

  function getDrawOptions () {
    return {
      polyline: showEditControl,
      polygon: false,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false
    }
  }

  function getEditOptions () {
    return {
      edit: showEditControl,
      remove: showEditControl
    }
  }

  function downloadSegments(segments) {
    const data = {
      "type": "FeatureCollection",
      "features": segments,
    }

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, "    ")));
    element.setAttribute('download', DOWNLOAD_FILENAME);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function downloadVisibleSegments() {
    downloadSegments(visibleSegmentsRef.current)
  }

  function downloadAllSegments() {
    downloadSegments(segments)
  }

  console.log('hidden? ' + !editableFGRef.current || editableFGRef.current.leafletElement._map._zoom <= 16)
  return (
    <>
      <Map
        center={{ lat: position.lat, lng: position.lng }}
        zoom={position.zoom}
        maxZoom={19}
        zoomControl={true}
        style={{height: MAP_HEIGHT}}
        onMoveEnd={_onMoveEnd}
        onZoomEnd={_onMoveEnd}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />

        <FeatureGroup ref={(reactFGref) => {_onFeatureGroupReady(reactFGref)}}>
          <EditControl
            position='topright'
            onEdited={_onEdited}
            onCreated={_onCreated}
            onDeleted={_onDeleted}
            onMounted={_onMounted}
            onDrawStart={_onDrawStart}
            onDrawStop={_onDrawStop}
            onEditStart={() => onSegmentSelect(null)}
            onEditStop={_onEditStop}
            onDeleteStart={() => {
              onSegmentSelect(null) // Clear any selected segment
              setDeleteModeEnabled(true)
            }}
            onDeleteStop={() => setDeleteModeEnabled(false)}
            draw={getDrawOptions()}
            edit={getEditOptions()}
          />
        </FeatureGroup>
      </Map>
      <div className={classes.downloadButton}>
        <SplitButton optionsAndCallbacks={[
          {label: 'Download'},
          {label: 'Sichtbaren Bereich', disabled: visibleSegmentsRef.current.length === 0, callback: downloadVisibleSegments},
          {label: 'Alle geladenen Bereiche', disabled: segments.length === 0, callback: downloadAllSegments},
        ]}/>
      </div>
    </>
  )

}
