const optionsForm = document.getElementById('post-options-form');
const optionsPostMap = new maplibregl.Map({
    container: 'option-post-map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`,
    center: [90.4125, 23.8103],
    zoom: 10,
    attributionControl: false
}).addControl(
    new maplibregl.AttributionControl({
        compact: true
    })
);

const optionMarker = new maplibregl.Marker({
    draggable: true
})
    .setLngLat([90.4125, 23.8103])
    .addTo(optionsPostMap);

function onDragEnd() {
    const lngLat = optionMarker.getLngLat();
    setLongLatOnForm(lngLat.lng, lngLat.lat, optionsForm);
}

optionMarker.on('dragend', onDragEnd);
let optsGeoLocate = new maplibregl.GeolocateControl({
    positionOptions: {
        timeout: 6000
    },
    fitBoundsOptions: {
        linear: true,
        maxZoom: 14
    }
});
optionsPostMap.addControl(optsGeoLocate);

optsGeoLocate.on('geolocate', function (data) {
    const { longitude, latitude } = data.coords;
    setLongLatOnForm(longitude, latitude, optionsForm);
    optionMarker.setLngLat([longitude, latitude]);
});
