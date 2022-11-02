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
    setLongLatOnForm(lngLat.lng, lngLat.lat, newPostForm);
}

marker.on('dragend', onDragEnd);
let newGeoLocate = new maplibregl.GeolocateControl({
    positionOptions: {
        timeout: 6000
    },
    fitBoundsOptions: {
        linear: true,
        maxZoom: 14
    }
});
newPostMap.addControl(newGeoLocate);
newPostMap.on('load', function () {
    newGeoLocate.trigger();
});
newGeoLocate.on('geolocate', function (data) {
    const { longitude, latitude } = data.coords;
    setLongLatOnForm(longitude, latitude, newPostForm);
    marker.setLngLat([longitude, latitude]);
});
