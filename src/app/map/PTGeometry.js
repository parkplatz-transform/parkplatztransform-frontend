import React from 'react'
import 'leaflet/dist/leaflet.css'
import { Polyline, Polygon, Tooltip } from 'react-leaflet'
import * as turf from '@turf/turf'
import 'leaflet-arrowheads'

const SELECTED_SEGMENT_COLOR = '#f00' // https://github.com/geoman-io/leaflet-geoman/issues/751
const UNSELECTED_EMPTY_SEGMENT_COLOR = 'purple'
const UNSELECTED_SEGMENT_COLOR = '#3388ff'


function PTGeometry({ key, coordinates, eventHandlers, lineWeight, isSelected, hasSubsegments, type }) {
  function setSegmentStyle() {
    const styles = {
      color: UNSELECTED_SEGMENT_COLOR,
      weight: lineWeight,
      lineJoin: 'square',
    }
    if (isSelected) {
      styles.color = SELECTED_SEGMENT_COLOR
    } else if (!hasSubsegments) {
      styles.color = UNSELECTED_EMPTY_SEGMENT_COLOR
    }
    return styles
  }
  if (type === 'LineString'){
    const line = turf.lineString(coordinates)
    const length = turf.length(line, { units: 'meters' })
    return <Polyline
      key={key}
      ref={(el) => {
        if (el && isSelected) {
          el.arrowheads({
            color: SELECTED_SEGMENT_COLOR,
            frequency: 'endonly',
            size: '5%',
            yawn: 80,
          })
        } else if (el) {
          el.deleteArrowheads()
        }
      }}
      eventHandlers={eventHandlers}
      pathOptions={setSegmentStyle()}
      positions={coordinates.map(([lat, lng]) => [lng, lat])}>
        <Tooltip>
            Länge: {Math.round(length + Number.EPSILON)} m
        </Tooltip>
    </Polyline>
  } else if (type === 'Polygon') {
    return <Polygon
      key={key}
      eventHandlers={eventHandlers}
      pathOptions={setSegmentStyle()}
      positions={coordinates[0].map(([lat, lng]) => [lng, lat])}>
    </Polygon>
  }
}

export default React.memo(PTGeometry, (last, next) => {
  return last.coordinates.join('-') === next.coordinates.join('-')
    && last.isSelected === next.isSelected
    && last.hasSubsegments === next.hasSubsegments
    && last.lineWeight === next.lineWeight
})