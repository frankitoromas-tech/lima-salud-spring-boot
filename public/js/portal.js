function mostrarSeccion(id) {
  document.querySelectorAll("[data-section]").forEach(function (section) {
    section.classList.add("section-hidden");
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.remove("section-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
