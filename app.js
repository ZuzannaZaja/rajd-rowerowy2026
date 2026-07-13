var ROUTE_POINTS = [
  { lat: 51.2925377, lng: 19.5042431 },
  { lat: 51.1907400, lng: 19.3392900 },
  { lat: 51.1225364, lng: 19.2898146 },
  { lat: 51.0511100, lng: 19.1573900 },
  { lat: 50.9430000, lng: 19.1690000 },
  { lat: 50.8147, lng: 19.1368 }
];

var JASNA_GORA = { lat: 50.8147, lng: 19.1368 };

var map;
var userMarker;
var userCircle;

window.initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: 51.0, lng: 19.3 },
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });

  new google.maps.Marker({
    position: JASNA_GORA,
    map: map,
    title: 'Jasna Góra, Częstochowa',
    label: { text: '\u{1F3C1}', fontSize: '20px' }
  });

  drawRoute();
};

function drawRoute() {
  var routePath = [
    { lat: 51.3692, lng: 19.3702 },
  ];
  for (var i = 0; i < ROUTE_POINTS.length; i++) {
    routePath.push(ROUTE_POINTS[i]);
  }

  new google.maps.Polyline({
    path: routePath,
    map: map,
    strokeColor: '#e74c3c',
    strokeWeight: 5,
    strokeOpacity: 0.9
  });

  for (var j = 0; j < routePath.length; j++) {
    new google.maps.Marker({
      position: routePath[j],
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: j === 0 ? 8 : 5,
        fillColor: j === 0 ? '#e74c3c' : '#f39c12',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2
      },
      title: j === 0 ? 'Start' : 'Punkt ' + j
    });
  }
}

function showUserOnMap(lat, lng, acc) {
  var userPos = { lat: lat, lng: lng };

  if (userMarker) userMarker.setMap(null);
  if (userCircle) userCircle.setMap(null);

  userMarker = new google.maps.Marker({
    position: userPos,
    map: map,
    title: 'Twoja lokalizacja',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#4285F4',
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 3
    }
  });

  if (acc) {
    userCircle = new google.maps.Circle({
      map: map,
      center: userPos,
      radius: acc,
      strokeColor: '#4285F4',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#4285F4',
      fillOpacity: 0.1
    });
  }

  var bounds = new google.maps.LatLngBounds();
  bounds.extend(userPos);
  bounds.extend(JASNA_GORA);
  map.fitBounds(bounds, 60);
}

function locateMe() {
  var btn = document.getElementById('locateBtn');
  var coordsEl = document.getElementById('coords');

  btn.disabled = true;
  btn.textContent = 'Szukam lokalizacji...';
  coordsEl.textContent = '';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        showUserOnMap(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
        coordsEl.textContent = pos.coords.latitude.toFixed(5) + ', ' + pos.coords.longitude.toFixed(5) +
          ' (dok\u0142adno\u015B\u0107: ' + Math.round(pos.coords.accuracy) + ' m)';
        btn.disabled = false;
        btn.textContent = 'Poka\u017C moj\u0105 lokalizacj\u0119';
      },
      function(err) {
        coordsEl.textContent = 'Nie uda\u0142o si\u0119: ' + err.message;
        btn.disabled = false;
        btn.textContent = 'Poka\u017C moj\u0105 lokalizacj\u0119';
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  } else {
    coordsEl.textContent = 'Geolokalizacja nie jest wspierana.';
    btn.disabled = false;
    btn.textContent = 'Poka\u017C moj\u0105 lokalizacj\u0119';
  }
}
