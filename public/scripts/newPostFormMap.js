const newPostForm = document.getElementById('new-post-form');
const newPostMap = new maplibregl.Map({
  container: 'new-post-map',
  style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`,
  center: [0, 0],
  zoom: 2
});

const marker = new maplibregl.Marker({
  draggable: true
})
  .setLngLat([0, 0])
  .addTo(newPostMap);

function onDragEnd() {
  const lngLat = marker.getLngLat();
  newPostForm.longitude.value = lngLat.lng;
  newPostForm.latitude.value = lngLat.lat;
  fetch(
    `https://api.maptiler.com/geocoding/${lngLat.lng},${lngLat.lat}.json?key=${mapTilerApiKey}`
  )
    .then((raw) => {
      return raw.json();
    })
    .then((data) => {
      newPostForm.name.value = data.features && data.features[0].place_name;
    })
    .catch(() => {});
}

marker.on('dragend', onDragEnd);
