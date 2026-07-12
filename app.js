const DESTINATION = { lat: 50.8147, lng: 19.1368 };
const DEST_NAME = 'Jasna Góra, Częstochowa';

let map;
let userMarker;
let userCircle;
let directionsRenderer;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: DESTINATION,
    mapId: 'rajd-rowerowy',
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false
  });

  new google.maps.Marker({
    position: DESTINATION,
    map,
    title: DEST_NAME,
    label: { text: '🏁', fontSize: '20px' }
  });

  directionsRenderer = new google.maps.DirectionsRenderer({
    map,
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#4285F4',
      strokeWeight: 5,
      strokeOpacity: 0.8
    }
  });

  locateMe();
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

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(userPos);
      bounds.extend(DESTINATION);
      map.fitBounds(bounds, 80);

      calcRoute(userPos);

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

function calcRoute(origin) {
  const directionsService = new google.maps.DirectionsService();

  directionsService.route(
    {
      origin,
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
