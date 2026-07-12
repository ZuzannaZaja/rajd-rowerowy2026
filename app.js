const WAYPOINTS = [
  { lat: 51.2925377, lng: 19.5042431 },
  { lat: 51.1907400, lng: 19.3392900 },
  { lat: 51.1225364, lng: 19.2898146 },
  { lat: 51.0511100, lng: 19.1573900 },
  { lat: 50.9430000, lng: 19.1690000 }
];

const DESTINATION = { lat: 50.8147, lng: 19.1368 };

let map;
let userMarker;
let userCircle;
let directionsRenderer;
let directionsService;

async function initMap() {
  const { Map } = await google.maps.importLibrary('maps');
  const { DirectionsRenderer, DirectionsService } = await google.maps.importLibrary('routes');
  const { Marker } = await google.maps.importLibrary('marker');
  const { Circle } = await google.maps.importLibrary('maps');

  directionsService = new DirectionsService();

  map = new Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: 51.0, lng: 19.3 },
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });

  directionsRenderer = new DirectionsRenderer({
    map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#e74c3c',
      strokeWeight: 6,
      strokeOpacity: 0.9
    }
  });

  new Marker({
    position: DESTINATION,
    map,
    title: 'Jasna Góra, Częstochowa',
    label: { text: '🏁', fontSize: '20px' }
  });

  showRoute();
}

function showRoute() {
  var waypoints = WAYPOINTS.map(function(p) {
    return { location: p, stopover: true };
  });

  directionsService.route(
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
  if (!navigator.geolocation) {
    document.getElementById('coords').textContent = 'Geolokalizacja nie jest wspierana.';
    return;
  }

  document.getElementById('locateBtn').disabled = true;
  document.getElementById('locateBtn').textContent = 'Szukam lokalizacji...';

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      var userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      var acc = pos.coords.accuracy;

      if (userMarker) userMarker.setMap(null);
      if (userCircle) userCircle.setMap(null);

      userMarker = new google.maps.Marker({
        position: userPos,
        map,
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
        map,
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

      document.getElementById('coords').textContent =
        pos.coords.latitude.toFixed(5) + ', ' + pos.coords.longitude.toFixed(5) +
        ' (dokładność: ' + Math.round(acc) + ' m)';

      document.getElementById('locateBtn').disabled = false;
      document.getElementById('locateBtn').textContent = 'Pokaż moją lokalizację';
    },
    function(err) {
      document.getElementById('coords').textContent = 'Błąd: ' + err.message;
      document.getElementById('locateBtn').disabled = false;
      document.getElementById('locateBtn').textContent = 'Pokaż moją lokalizację';
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}

initMap();
