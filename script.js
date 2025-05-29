const steps = document.querySelectorAll(".step");
const graphicBox = document.getElementById("graphic-box");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      steps.forEach(step => step.classList.remove("active"));
      entry.target.classList.add("active");

      const stepNumber = entry.target.getAttribute("data-step");
      graphicBox.textContent = `You're viewing: Step ${stepNumber}`;
    }
  });
}, {
  threshold: 0.5
});

steps.forEach(step => observer.observe(step));
