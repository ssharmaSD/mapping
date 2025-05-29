const steps = document.querySelectorAll(".step");

// Set up the Leaflet map
const map = L.map('map').setView([35, 105], 4);  // Default: China

// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
//   attribution: '&copy; OpenStreetMap contributors &copy; CartoDB'
// }).addTo(map);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CartoDB'
}).addTo(map);


// Map coordinates for each country
const countryCoords = {
  "China": [35.8617, 104.1954],
  "Japan": [36.2048, 138.2529],
  "South Korea": [35.9078, 127.7669],
  "Taiwan": [23.6978, 120.9605]
};

// Observer to trigger scrolling events
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      steps.forEach(step => step.classList.remove("active"));
      entry.target.classList.add("active");

      const country = entry.target.getAttribute("data-country");
      if (countryCoords[country]) {
        map.flyTo(countryCoords[country], 5);
      }
    }
  });
}, {
  threshold: 0.5
});

steps.forEach(step => observer.observe(step));
