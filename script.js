// Setup base map
const map = L.map('map').setView([35, 105], 2);

// English map tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CartoDB'
}).addTo(map);

// --- Layer setup per step ---
const stepLayers = {
  "step-1": L.layerGroup(),
  "step-2": L.layerGroup(),
};

const china = [35.8617, 104.1954];
const uk = [55.3781, -3.4360];
const us = [37.0902, -95.7129];

// Step 1: China only
stepLayers["step-1"].addLayer(
  L.circle(china, {
    radius: 500000,
    color: 'red'
  }).bindPopup("China")
);

// Step 2: China, UK, US + arrows
stepLayers["step-2"].addLayer(L.marker(china).bindPopup("China"));
stepLayers["step-2"].addLayer(L.marker(uk).bindPopup("UK"));
stepLayers["step-2"].addLayer(L.marker(us).bindPopup("USA"));

// Draw arrows with PolylineDecorator
const polylineUK = L.polyline([china, uk], { color: 'blue' });
const polylineUS = L.polyline([china, us], { color: 'blue' });

stepLayers["step-2"].addLayer(polylineUK);
stepLayers["step-2"].addLayer(polylineUS);

// Arrowheads
const decoratorUK = L.polylineDecorator(polylineUK, {
  patterns: [
    { offset: '50%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 10, pathOptions: { fillOpacity: 1, weight: 0 } }) }
  ]
});

const decoratorUS = L.polylineDecorator(polylineUS, {
  patterns: [
    { offset: '50%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 10, pathOptions: { fillOpacity: 1, weight: 0 } }) }
  ]
});

stepLayers["step-2"].addLayer(decoratorUK);
stepLayers["step-2"].addLayer(decoratorUS);

// Track and update active layer
let activeLayer = null;

// Scroll-triggered layer switching
const steps = document.querySelectorAll(".step");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      steps.forEach(step => step.classList.remove("active"));
      entry.target.classList.add("active");

      const stepId = entry.target.getAttribute("data-step-id");

      if (activeLayer) {
        activeLayer.remove();
      }

      activeLayer = stepLayers[stepId];
      activeLayer.addTo(map);
    }
  });
}, {
  threshold: 0.5
});

steps.forEach(step => observer.observe(step));
