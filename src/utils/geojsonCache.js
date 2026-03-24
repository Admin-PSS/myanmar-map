// Shared GeoJSON caches — fetched once, reused across all components

export const geojsonStore = {
  states: null,
  townships: null,
}

export function fetchGeoJSON(key, url) {
  return new Promise((resolve, reject) => {
    if (geojsonStore[key]) { resolve(geojsonStore[key]); return }
    fetch(url)
      .then(r => r.json())
      .then(data => { geojsonStore[key] = data; resolve(data) })
      .catch(reject)
  })
}
