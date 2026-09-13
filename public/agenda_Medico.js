// Manejo de la visibilidad de las secciones
function mostrarCitas() {
  document.getElementById("dashboard").classList.add("section-hidden");
  setTimeout(() => {
    document.getElementById("vistaCitas").classList.remove("section-hidden");
    document.getElementById("vistaCitas").style.opacity = 1;
  }, 100); // Pequeño retraso para que la transición CSS funcione
}

function mostrarDashboard() {
  document.getElementById("vistaCitas").style.opacity = 0;
  setTimeout(() => {
    document.getElementById("vistaCitas").classList.add("section-hidden");
    document.getElementById("dashboard").classList.remove("section-hidden");
  }, 400);
}

// Simulación dinámica de agregar una cita a la vista
document.getElementById("formCita").addEventListener("submit", function (e) {
  e.preventDefault(); // Evita recargar la página

  // Capturamos los datos (simulados)
  const especialidad =
    this.querySelector("select:nth-of-type(2)").value || "General";
  const fechaHoraInput = this.querySelector(
    'input[type="datetime-local"]',
  ).value;

  if (!fechaHoraInput) {
    alert("Por favor ingresa una fecha.");
    return;
  }

  // Formatear la hora
  const fechaObj = new Date(fechaHoraInput);
  const horaFormateada = fechaObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Crear la nueva tarjeta de HTML dinámicamente
  const nuevaCitaHTML = `
        <div class="col" style="animation: fadeInUp 0.5s ease-out forwards;">
            <div class="card h-100 shadow-sm border-0 border-start border-success border-4">
                <img src="https://ui-avatars.com/api/?name=Paciente+Nuevo&background=10b981&color=fff&size=150" class="card-img-top" alt="Paciente">
                <div class="card-body">
                    <h5 class="card-title fw-bold">Paciente Nuevo</h5>
                    <p class="card-text mb-1 small"><strong>Estado:</strong> Registrado hoy</p>
                    <hr>
                    <span class="badge bg-success">${especialidad}</span>
                    <p class="mt-2 fw-bold text-success"><i class="bi bi-clock"></i> ${horaFormateada}</p>
                </div>
            </div>
        </div>
    `;

  // Seleccionamos el contenedor de las tarjetas y le inyectamos la nueva
  const contenedorTarjetas = document.querySelector("#vistaCitas .row-cols-1");
  contenedorTarjetas.insertAdjacentHTML("afterbegin", nuevaCitaHTML); // Lo añade al inicio

  // Ocultar modal y mostrar éxito
  bootstrap.Modal.getInstance(document.getElementById("modalCita")).hide();

  // Opcional: Redirigir automáticamente a la vista de citas
  mostrarCitas();

  // Limpiar formulario
  this.reset();
});
// Simulación para el formulario de Paciente
document
  .getElementById("formPaciente")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Paciente registrado con éxito.");
    bootstrap.Modal.getInstance(
      document.getElementById("modalPaciente"),
    ).hide();
    this.reset();
  });
