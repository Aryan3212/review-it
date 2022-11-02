const optionsForm = document.getElementById('post-options-form');
const optionsPostMap = new maplibregl.Map({
    container: 'option-post-map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`,
    center: [0, 0],
    zoom: 2
});

const optionMarker = new maplibregl.Marker({
    draggable: true
})
    .setLngLat([0, 0])
    .addTo(optionsPostMap);

function onDragEnd() {
    const lngLat = optionMarker.getLngLat();
    optionsForm.longitude.value = lngLat.lng;
    optionsForm.latitude.value = lngLat.lat;
    fetch(
        `https://api.maptiler.com/geocoding/${lngLat.lng},${lngLat.lat}.json?key=${mapTilerApiKey}`
    )
        .then((raw) => {
            return raw.json();
        })
        .then((data) => {
            optionsForm.name.value =
                data.features && data.features[0].place_name;
        })
        .catch(() => {});
}

optionMarker.on('dragend', onDragEnd);
