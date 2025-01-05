// Map initialization 
var map = L.map('map').setView([-27.6135936, -48.594944], 8);

// OSM layer
var osm = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
osm.addTo(map);

// Add Locate control
L.control.locate().addTo(map);

// Event handler for location found
map.on('locationfound', onLocationFound);

// Event handler for location error
map.on('locationerror', onLocationError);

// Function to handle location found
function onLocationFound(e) {
  var data = {
    'Nome': 'User', // You can customize the username as needed
    'Tipo': 'User Location',
    'Status': 'Active',
    'Latitude': e.latitude,
    'Longitude': e.longitude,
    'Horario': new Date().toLocaleString() // Include the timestamp
  };

  // Send data to Google Sheets
  sendDataToGoogleSheets(data);

  // You can customize the popup content as needed
  L.popup()
    .setLatLng(e.latlng)
    .setContent('You are here: ' + e.latlng.toString())
    .openOn(map);
}

// Function to handle location error
function onLocationError(e) {
  alert(e.message);
}

// ...

// Function to send data to Google Sheets
function sendDataToGoogleSheets(data) {
  // Check if the data has already been sent for this session
  if (localStorage.getItem('dataSent')) {
    console.log('Data already sent for this session.');
    return;
  }

  // Format latitude and longitude with proper decimal separator
  data.Latitude = data.Latitude.toString().replace('.', ',');
  data.Longitude = data.Longitude.toString().replace('.', ',');

  // Convert data to URL-encoded format
  var formData = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');

  // Make a POST request to the server endpoint
  fetch('https://script.google.com/macros/s/AKfycbwFG6Y4r-pIt-L5MIa6AhEtIpI66Q2tDeVUzEGeMwbTaye9U3fsVa2K_tm190ApyN8/exec', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  })
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData);

      // Set a flag in localStorage to indicate that data has been sent
      localStorage.setItem('dataSent', 'true');
    })
    .catch(error => {
      console.error('Error sending data to Google Sheets:', error);
    });
}

