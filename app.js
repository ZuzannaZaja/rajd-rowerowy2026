const ROUTE = {
  origin: 'Polna 53, 97-371 Wola Krzysztoporska',
  waypoints: [
    { location: { lat: 51.2925377, lng: 19.5042431 }, stopover: true },
    { location: { lat: 51.1907400, lng: 19.3392900 }, stopover: true },
    { location: { lat: 51.1225364, lng: 19.2898146 }, stopover: true },
    { location: { lat: 51.0511100, lng: 19.1573900 }, stopover: true },
    { location: { lat: 50.9430000, lng: 19.1690000 }, stopover: true },
    { location: 'Jasna Góra, ul. o. A. Kordeckiego 2, 42-225 Częstochowa', stopover: true }
  ],
  destination: 'Stara Kamienica Apartamenty, Generała Jana Henryka Dąbrowskiego 10, 42-202 Częstochowa'
};

let map;
let userMarker;
let userCircle;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: 51.15, lng: 19.3 },
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });

  directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: '#e74c3c',
      strokeWeight: 5,
      strokeOpacity: 0.9
    }
  });

  showRoute();
}

function showRoute() {
  const directionsService = new google.maps.DirectionsService();
  directionsService.route(
    {
      origin: ROUTE.origin,
      waypoints: ROUTE.waypoints,
      destination: ROUTE.destination,
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
  const btn = document.getElementById('locateBtn');
  const coordsEl = document.getElementById('coords');

  if (!navigator.geolocation) {
    coordsEl.textContent = 'Geolokalizacja nie jest wspierana przez tę przeglądarkę.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Szukam lokalizacji...';

  navigator.geolocation.getCurrentPosition(
    function(pos) {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const acc = pos.coords.accuracy;
      const userPos = { lat, lng };

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

      coordsEl.textContent = 'Szerokość: ' + lat.toFixed(5) + ', Długość: ' + lng.toFixed(5) + ' (dokładność: ' + Math.round(acc) + ' m)';
      btn.disabled = false;
      btn.textContent = 'Pokaż moją lokalizację';
    },
    function(err) {
      coordsEl.textContent = 'Nie udało się ustalić lokalizacji: ' + err.message;
      btn.disabled = false;
      btn.textContent = 'Pokaż moją lokalizację';
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}
