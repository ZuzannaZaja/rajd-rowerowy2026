const DESTINATION = [50.8147, 19.1368];
const DEST_NAME = 'Jasna Góra, Częstochowa';

const map = L.map('map', { zoomControl: true }).setView(DESTINATION, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const destMarker = L.circleMarker(DESTINATION, {
  radius: 12, color: '#e74c3c', fillColor: '#e74c3c', fillOpacity: 0.3, weight: 3
}).addTo(map);
destMarker.bindPopup('<b>' + DEST_NAME + '</b>');

let userMarker = null;
let userCircle = null;

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

      if (userMarker) { map.removeLayer(userMarker); }
      if (userCircle) { map.removeLayer(userCircle); }

      userMarker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:#4285F4;width:20px;height:20px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
          iconSize: [20, 20], iconAnchor: [10, 10]
        })
      }).addTo(map);
      userMarker.bindPopup('<b>Twoja lokalizacja</b>');

      userCircle = L.circle([lat, lng], {
        radius: acc, color: '#4285F4', fillColor: '#4285F4', fillOpacity: 0.1, weight: 2
      }).addTo(map);

      map.setView([lat, lng], 14);

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
