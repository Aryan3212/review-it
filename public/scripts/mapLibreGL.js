let map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`,
    center:
        data.features.length > 1
            ? [90.36864, 23.83747]
            : data.features[0].geometry.coordinates,
    zoom: 10,
    attributionControl: false
})
    .addControl(
        new maplibregl.AttributionControl({
            compact: true
        })
    )
    .addControl(new maplibregl.NavigationControl(), 'top-left');
map.on('load', function () {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource('posts', {
        type: 'geojson',
        // Point to GeoJSON data. This example visualizes all M1.0+ posts
        // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: data,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'posts',
        filter: ['has', 'point_count'],
        paint: {
            // Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                100,
                '#f1f075',
                750,
                '#f28cb1'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                100,
                30,
                750,
                40
            ]
        }
    });

    map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'posts',
        filter: ['has', 'point_count'],
        layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'posts',
        filter: ['!', ['has', 'point_count']],
        paint: {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });

    // inspect a cluster on click
    map.on('click', 'clusters', function (e) {
        let features = map.queryRenderedFeatures(e.point, {
            layers: ['clusters']
        });

        let clusterId = features[0].properties.cluster_id;
        map.getSource('posts').getClusterExpansionZoom(
            clusterId,
            function (err, zoom) {
                if (err) return;

                map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom: 5
                });
            }
        );
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.
    map.on('click', 'unclustered-point', function (e) {
        let coordinates = e.features[0].geometry.coordinates.slice();
        let name = e.features[0].properties.name;
        let title = e.features[0].properties.title;
        let id = e.features[0].properties.id;
        console.log(e.features[0]);
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(
                `<a href="/posts/${id}"><h6>${title}</h6></a><p>${name}</p>`
            )
            .addTo(map);
    });

    map.on('mouseenter', 'clusters', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', function () {
        map.getCanvas().style.cursor = '';
    });
    let geoLocate = new maplibregl.GeolocateControl({
        positionOptions: {
            timeout: 6000
        },
        fitBoundsOptions: {
            linear: true,
            maxZoom: 14
        }
    });
    // Add the control to the map.
    map.addControl(geoLocate);
    // Set an event listener that fires
    geoLocate.on('error', function () {
        console.log('An error event has occurred.');
    });
});
