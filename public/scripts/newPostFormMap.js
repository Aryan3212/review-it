const newPostForm = document.getElementById('new-post-form');
const newPostMap = new maplibregl.Map({
    container: 'new-post-map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`,
    center: [90.4125, 23.8103],
    zoom: 10,
    attributionControl: false
})
    .addControl(
        new maplibregl.AttributionControl({
            compact: true
        })
    )
    .addControl(new maplibregl.NavigationControl(), 'top-left');

const marker = new maplibregl.Marker({
    draggable: true
})
    .setLngLat([90.4125, 23.8103])
    .addTo(newPostMap);

function onDragEnd() {
    showLoader();
    const lngLat = marker.getLngLat();
    setLongLatOnForm(lngLat.lng, lngLat.lat, newPostForm);
    removeLoader();
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

newGeoLocate.on('geolocate', function (data) {
    const { longitude, latitude } = data.coords;
    setLongLatOnForm(longitude, latitude, newPostForm);
    marker.setLngLat([longitude, latitude]);
});
