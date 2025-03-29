function initMap() {
  // Defensive config checks
  if (!window.GOOGLE_MAPS_API_KEY || !window.CODA_API_TOKEN || !window.DOC_ID || !window.TABLE_ID) {
    alert("One or more Coda/Maps config values are missing. Check that codaConfig.js is loading properly.");
    console.error("Config values:", {
      GOOGLE_MAPS_API_KEY: window.GOOGLE_MAPS_API_KEY,
      CODA_API_TOKEN: window.CODA_API_TOKEN,
      DOC_ID: window.DOC_ID,
      TABLE_ID: window.TABLE_ID
    });
    return;
  }

  // Confirm values in the console
  console.log("GOOGLE_MAPS_API_KEY:", window.GOOGLE_MAPS_API_KEY);
  console.log("DOC_ID:", window.DOC_ID);
  console.log("TABLE_ID:", window.TABLE_ID);

  const CODA_API_TOKEN = window.CODA_API_TOKEN;
  const DOC_ID = window.DOC_ID;
  const TABLE_ID = window.TABLE_ID;
  const GOOGLE_MAPS_API_KEY = window.GOOGLE_MAPS_API_KEY;

  let map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 20, lng: 0 }
  });

  async function geocodeAddress(address) {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`);
      const data = await response.json();
      if (data.status === 'OK') {
        return data.results[0].geometry.location;
      } else {
        console.warn(`Geocoding failed for "${address}": ${data.status}`);
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  async function loadTripsAndMap() {
    try {
      const [columnsRes, rowsRes] = await Promise.all([
        fetch(`https://coda.io/apis/v1/docs/${DOC_ID}/tables/${TABLE_ID}/columns`, {
          headers: { Authorization: `Bearer ${CODA_API_TOKEN}` }
        }),
        fetch(`https://coda.io/apis/v1/docs/${DOC_ID}/tables/${TABLE_ID}/rows`, {
          headers: { Authorization: `Bearer ${CODA_API_TOKEN}` }
        })
      ]);

      const columns = await columnsRes.json();
      const rows = await rowsRes.json();

      const table = document.getElementById('tripTable');
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      document.getElementById('loading').style.display = 'none';

      if (!rows.items || rows.items.length === 0) {
        document.body.insertAdjacentHTML('beforeend', `<p style="color: red;">No data found in Coda table.</p>`);
        return;
      }

      const columnMap = {};
      columns.items.forEach(col => {
        columnMap[col.id] = col.name;
      });

      const columnIds = Object.keys(rows.items[0].values);
      const locationColumnId = Object.keys(columnMap).find(id => columnMap[id].toLowerCase() === 'location');

      if (!locationColumnId) {
        alert("No column titled 'Location' found in your table.");
        console.warn("Available columns:", columnMap);
        return;
      }

      // Build table header
      thead.innerHTML = '<tr>' + columnIds.map(id => `<th>${columnMap[id]} (id: ${id})</th>`).join('') + '</tr>';

      const bounds = new google.maps.LatLngBounds();

      for (const row of rows.items) {
        const rowData = row.values;
        const rowHTML = '<tr>' + columnIds.map(id => {
          let value = rowData[id];
          if (typeof value === 'object') value = JSON.stringify(value);
          return `<td>${value ?? ''}</td>`;
        }).join('') + '</tr>';
        tbody.insertAdjacentHTML('beforeend', rowHTML);

        const locationValue = rowData[locationColumnId];
        if (locationValue) {
          const coords = await geocodeAddress(locationValue);
          if (coords) {
            new google.maps.Marker({
              position: coords,
              map,
              title: locationValue
            });
            bounds.extend(coords);
          }
        }
      }

      table.style.display = 'table';
      map.fitBounds(bounds);

    } catch (err) {
      console.error('Error loading Coda data:', err);
      document.getElementById('loading').textContent = 'Error loading data.';
    }
  }

  // Kick things off
  loadTripsAndMap();
}
