const DEFAULT_MAP_POSITION = { 
  lat: 52.501389, // Center of Berlin
  lng: 13.402500, 
  zoom: 10 
}

const MAP_POSITION = 'MAP_POSITION'

const loadMapPosition = () => {
  try {
    const position = JSON.parse(localStorage.getItem(MAP_POSITION))
    return position ?? DEFAULT_MAP_POSITION
  } catch (error) {
    return DEFAULT_MAP_POSITION
  }
}

const persistMapPosition = (position) => {
  try {
    localStorage.setItem(MAP_POSITION, JSON.stringify(position))
  } catch (error) {
    console.warn('Failed to persist map position', error)
  }
}

export { loadMapPosition, persistMapPosition }
