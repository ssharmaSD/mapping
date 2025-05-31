mapboxgl.accessToken = 'pk.eyJ1Ijoic3VzMDA5IiwiYSI6ImNtYmNna3N6azBxaGcyaW9ja2h0c21tbmEifQ.wqsax7wbr9g1_i1wG3Ee0A';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v11',
  center: [104.1954, 35.8617], // China
  zoom: 2
});

// Coordinates
const coords = {
  china: [104.1954, 35.8617],
  uk: [-3.4360, 55.3781],
  us: [-95.7129, 37.0902],
  hawaii: [-155.5828, 19.8968]
};

// Step actions
const steps = {
  1: () => {
    map.flyTo({ center: coords.china, zoom: 4 });
    clearArrows();
  },
  2: () => {
    map.flyTo({ center: coords.china, zoom: 2.5 });
    drawArrows();
  },
  3: () => {
    map.flyTo({ center: coords.hawaii, zoom: 4 });
    clearArrows();
  }
};

// Draw arrows using GeoJSON lines
let arrowLayerId = 'arrows';

function drawArrows() {
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [coords.china, coords.uk]
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [coords.china, coords.us]
        }
      }
    ]
  };

  if (map.getLayer(arrowLayerId)) {
    map.getSource(arrowLayerId).setData(geojson);
  } else {
    map.addSource(arrowLayerId, {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: arrowLayerId,
      type: 'line',
      source: arrowLayerId,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
        'symbol-placement': 'line'
      },
      paint: {
        'line-color': '#0077ff',
        'line-width': 2
      }
    });

    map.addLayer({
      id: `${arrowLayerId}-arrows`,
      type: 'symbol',
      source: arrowLayerId,
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 50,
        'icon-image': 'arrow',
        'icon-size': 0.5,
        'icon-allow-overlap': true
      }
    });
  }
}

// Clear arrow layers
function clearArrows() {
  if (map.getLayer(arrowLayerId)) map.removeLayer(arrowLayerId);
  if (map.getLayer(`${arrowLayerId}-arrows`)) map.removeLayer(`${arrowLayerId}-arrows`);
  if (map.getSource(arrowLayerId)) map.removeSource(arrowLayerId);
}

// Load arrow icon
map.on('load', () => {
  map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/arrow.png', (err, image) => {
    if (err) throw err;
    if (!map.hasImage('arrow')) map.addImage('arrow', image);
  });
});

// Scroll logic
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const step = entry.target.dataset.step;
      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      entry.target.classList.add('active');
      if (steps[step]) steps[step]();
    }
  });
}, {
  threshold: 0.5
});

document.querySelectorAll('.step').forEach(step => observer.observe(step));
