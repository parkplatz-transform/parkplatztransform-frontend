const DEFAULT_MAP_POSITION = {
  lat: 52.501389, // Center of Berlin
  lng: 13.402500,
  zoom: 10
}

const loadMapPosition = () => {
  const locationStringArray = window.location.href.split('#')
  if (locationStringArray.length > 1) {
    const latLngZoom = locationStringArray[1].split(',')
    return {
      lat: Number(latLngZoom[0]),
      lng: Number(latLngZoom[1]),
      zoom: Number(latLngZoom[2])
    }
  }
  return DEFAULT_MAP_POSITION
}

const persistMapPosition = (position) => {
  try {
    window.history.pushState(null, 'ParkplatzTransform', `#${position.lat},${position.lng},${position.zoom}`)
  } catch (error) {
    console.warn('Failed to persist map position', error)
  }
}

export { loadMapPosition, persistMapPosition }
