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

document.addEventListener("DOMContentLoaded", function () {
  const buscador = document.getElementById("buscadorCitas");
  if (!buscador) return;

  buscador.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    document.querySelectorAll(".cita-card").forEach(function (card) {
      const text = (card.dataset.searchCita || "").toLowerCase();
      card.classList.toggle("d-none", query.length > 0 && !text.includes(query));
    });
  });
});
