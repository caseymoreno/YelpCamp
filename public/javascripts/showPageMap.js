mapboxgl.accessToken = 'pk.eyJ1IjoiY21vcmUxMzQiLCJhIjoiY2w2c2dwNnJwMGhnYTNsbXNoYXhscDVvciJ9.MhkVMftpqCWBbeeJ9A4KYQ';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
    projection: 'globe' // display the map as a 3D globe
});

map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
});
/*
const popup = new mapboxgl.Popup({ offset: 25 }).setText(
    `${title}`
);

const titleH = document.createElement('h3');
const paraP = document.createElement('p');

titleH.id = 'marker';
paraP.id = 'marker';*/

const marker = new mapboxgl.Marker()
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${title}</h3><p>${locationMap}</p>`
        )
    )
    .addTo(map);