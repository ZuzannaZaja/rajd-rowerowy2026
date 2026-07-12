var WAYPOINTS = [
  { lat: 51.2925377, lng: 19.5042431 },
  { lat: 51.1907400, lng: 19.3392900 },
  { lat: 51.1225364, lng: 19.2898146 },
  { lat: 51.0511100, lng: 19.1573900 },
  { lat: 50.9430000, lng: 19.1690000 }
];

var DESTINATION = { lat: 50.8147, lng: 19.1368 };

var map;
var userMarker;
var userCircle;
var directionsRenderer;

window.initMap = function() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: 51.0, lng: 19.3 },
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });

  new google.maps.Marker({
    position: DESTINATION,
    map: map,
    title: 'Jasna Góra, Częstochowa',
    label: { text: '\u{1F3C1}', fontSize: '20px' }
  });

  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#e74c3c',
      strokeWeight: 6,
      strokeOpacity: 0.9
    }
  });

  showRoute();
};

function showRoute() {
  var service = new google.maps.DirectionsService();
  var waypoints = [];
  for (var i = 0; i < WAYPOINTS.length; i++) {
    waypoints.push({ location: WAYPOINTS[i], stopover: true });
  }

  service.route(
    {
      origin: 'Polna 53, 97-371 Wola Krzysztoporska',
      waypoints: waypoints,
      destination: DESTINATION,
      travelMode: google.maps.TravelMode.BICYCLING,
      unitSystem: google.maps.UnitSystem.METRIC
    },
    function(result, status) {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      }
    }
  );
}

function locateMe() {
  var btn = document.getElementById('locateBtn');
  var coordsEl = document.getElementById('coords');

  if (!navigator.geolocation) {
    coordsEl.textContent = 'Geolokalizacja nie jest wspierana.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Szukam lokalizacji...';

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      var userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      var acc = pos.coords.accuracy;

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

      var bounds = new google.maps.LatLngBounds();
      bounds.extend(userPos);
      bounds.extend(DESTINATION);
      map.fitBounds(bounds, 60);

      coordsEl.textContent = pos.coords.latitude.toFixed(5) + ', ' + pos.coords.longitude.toFixed(5) + ' (dok\u0142adno\u015B\u0107: ' + Math.round(acc) + ' m)';
      btn.disabled = false;
      btn.textContent = 'Poka\u017C moj\u0105 lokalizacj\u0119';
    },
    function(err) {
      coordsEl.textContent = 'B\u0142\u0105d: ' + err.message;
      btn.disabled = false;
      btn.textContent = 'Poka\u017C moj\u0105 lokalizacj\u0119';
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}
