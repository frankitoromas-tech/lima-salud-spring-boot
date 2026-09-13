const SERVICIOS = [
  {
    id: "cardiologia",
    nombre: "Cardiología",
    icono: "bi-heart-pulse",
    imagen: "Imagenes/cardiologia.jpg",
  },
  {
    id: "pediatria",
    nombre: "Pediatría",
    icono: "bi-person-hearts",
    imagen: "Imagenes/pediatria.jpg",
  },
  {
    id: "traumatologia",
    nombre: "Traumatología",
    icono: "bi-bandaid",
    imagen: "Imagenes/traumatologia.jpg",
  },
  {
    id: "neurologia",
    nombre: "Neurología",
    icono: "bi-brain",
    imagen: "Imagenes/neurologia.jpg",
  },
];

const MEDICOS = {
  cardiologia: [
    {
      nombre: "Dr. Pérez Rodríguez",
      horarios: [
        { dia: "Lunes", hora: "08:00", modalidad: "Presencial" },
        { dia: "Miércoles", hora: "10:00", modalidad: "Presencial" },
        { dia: "Viernes", hora: "14:00 ", modalidad: "Presencial" },
      ],
    },
    {
      nombre: "Dra. López Vargas",
      horarios: [
        { dia: "Martes", hora: "09:00", modalidad: "Presencial" },
        { dia: "Jueves", hora: "15:00", modalidad: "Presencial" },
      ],
    },
  ],
  pediatria: [
    {
      nombre: "Dra. Torres Quispe",
      horarios: [
        { dia: "Lunes", hora: "07:00", modalidad: "Presencial" },
        { dia: "Miércoles", hora: "13:00", modalidad: "Presencial" },
      ],
    },
    {
      nombre: "Dr. Mamani Flores",
      horarios: [
        { dia: "Martes", hora: "08:00 ", modalidad: "Telemedicina" },
        { dia: "Viernes", hora: "10:00 ", modalidad: "Presencial" },
      ],
    },
  ],
  traumatologia: [
    {
      nombre: "Dr. Cáceres Huanca",
      horarios: [
        { dia: "Lunes", hora: "09:00 ", modalidad: "Presencial" },
        { dia: "Jueves", hora: "14:00 ", modalidad: "Presencial" },
      ],
    },
  ],
  neurologia: [
    {
      nombre: "Dra. Salas Mendoza",
      horarios: [
        { dia: "Martes", hora: "10:00", modalidad: "Presencial" },
        { dia: "Viernes", hora: "08:00", modalidad: "Telemedicina" },
      ],
    },
  ],
};

let pasoActual = 0;
let citaEnCurso = {};

function ocultarTodo() {
  ["dashboard", "servicios", "misCitas"].forEach((id) =>
    document.getElementById(id).classList.add("section-hidden"),
  );
}
function mostrarDashboard() {
  ocultarTodo();
  document.getElementById("dashboard").classList.remove("section-hidden");
}
function mostrarServicios() {
  ocultarTodo();
  document.getElementById("servicios").classList.remove("section-hidden");

  var cont = document.getElementById("gridServiciosPage");
  cont.innerHTML = SERVICIOS.map(function (s) {
    return (
      '<div class="col-md-4">' +
      '<div class="card p-0 overflow-hidden">' +
      '<img src="' +
      s.imagen +
      '" aspect-ratio:16/9; object-fit:cover; width:100%;" alt="' +
      s.nombre +
      '">' +
      '<div class="p-3">' +
      "<h5>" +
      s.nombre +
      "</h5>" +
      '<button class="btn btn-primary mt-1 w-100" data-bs-toggle="modal" data-bs-target="#modalCita">Inscribirse</button>' +
      "</div></div></div>"
    );
  }).join("");
}
function mostrarMisCitas() {
  ocultarTodo();
  document.getElementById("misCitas").classList.remove("section-hidden");
  renderizarCitas();
}

function irAPaso(n) {
  pasoActual = n;
  document
    .getElementById("paso1")
    .classList.toggle("section-hidden", pasoActual !== 0);
  document
    .getElementById("paso2")
    .classList.toggle("section-hidden", pasoActual !== 1);
  const pct = pasoActual === 0 ? 0 : 50;
  document.getElementById("barraProgreso").style.width = pct + "%";
  document.getElementById("labelPaso").textContent =
    "Paso " + (pasoActual + 1) + " de 2";
}

function anteriorPaso() {
  if (pasoActual > 0) irAPaso(pasoActual - 1);
}

function guardarPaso1() {
  var nombre = document.getElementById("inp_nombre").value.trim();
  var dni = document.getElementById("inp_dni").value.trim();
  var edad = document.getElementById("inp_edad").value.trim();
  var parent = document.getElementById("inp_parentesco").value.trim();

  if (!nombre || !dni || !edad || !parent) {
    alert("Por favor completa todos los campos.");
    return;
  }

  citaEnCurso = { nombre: nombre, dni: dni, edad: edad, parentesco: parent };
  renderizarServicios();
  irAPaso(1);
}

function renderizarServicios() {
  var cont = document.getElementById("gridServicios");
  cont.innerHTML = SERVICIOS.map(function (s) {
    return (
      '<div class="col-6 col-md-3">' +
      '<div class="card text-center p-3 h-100 card-servicio border" id="srv_' +
      s.id +
      '" onclick="seleccionarServicio(\'' +
      s.id +
      "')\">" +
      '<i class="bi ' +
      s.icono +
      ' fs-2 text-primary mb-2"></i>' +
      '<small class="fw-semibold">' +
      s.nombre +
      "</small>" +
      "</div></div>"
    );
  }).join("");

  document.getElementById("tablaHorarios").innerHTML = "";
  document.getElementById("tablaHorarios").classList.add("section-hidden");
  document.getElementById("btnRegistrar").disabled = true;
  citaEnCurso.servicio = null;
  citaEnCurso.medico = null;
}

function seleccionarServicio(id) {
  document.querySelectorAll(".card-servicio").forEach(function (c) {
    c.classList.remove("border-primary", "border-2");
  });
  document
    .getElementById("srv_" + id)
    .classList.add("border-primary", "border-2");

  var srv = SERVICIOS.find(function (s) {
    return s.id === id;
  });
  citaEnCurso.servicio = srv.nombre;
  citaEnCurso.servicioId = id;
  citaEnCurso.medico = null;
  document.getElementById("btnRegistrar").disabled = true;

  renderizarTablaHorarios(id);
  document.getElementById("tablaHorarios").classList.remove("section-hidden");
}

function renderizarTablaHorarios(servicioId) {
  var medicos = MEDICOS[servicioId] || [];
  var rows = "";

  medicos.forEach(function (m) {
    m.horarios.forEach(function (h, i) {
      var uid = (m.nombre + "_" + h.dia + "_" + h.hora).replace(/[\s:–]/g, "_");
      rows += "<tr>";
      if (i === 0) {
        rows +=
          '<td rowspan="' +
          m.horarios.length +
          '" class="align-middle fw-semibold small">' +
          m.nombre +
          "</td>";
      }
      rows += '<td class="small">' + h.dia + "</td>";
      rows += '<td class="small"><strong>' + h.hora + "</strong></td>";
      var badgeClass =
        h.modalidad === "Presencial" ? "bg-success" : "bg-info text-dark";
      rows +=
        '<td><span class="badge ' +
        badgeClass +
        '">' +
        h.modalidad +
        "</span></td>";
      rows +=
        '<td><button class="btn btn-sm btn-primary btn-horario" id="btn_' +
        uid +
        '" ' +
        "onclick=\"seleccionarHorario('" +
        m.nombre +
        "','" +
        h.dia +
        "','" +
        h.hora +
        "','" +
        h.modalidad +
        "','btn_" +
        uid +
        "')\">" +
        "Seleccionar</button></td>";
      rows += "</tr>";
    });
  });

  document.getElementById("tablaHorarios").innerHTML =
    '<h6 class="mt-3 mb-2 fw-semibold">Horarios disponibles — ' +
    citaEnCurso.servicio +
    "</h6>" +
    '<div class="table-responsive">' +
    '<table class="table table-bordered table-sm align-middle mb-0">' +
    '<thead class="table-light"><tr><th>Médico</th><th>Día</th><th>Horario</th><th>Modalidad</th><th>Acción</th></tr></thead>' +
    "<tbody>" +
    rows +
    "</tbody></table></div>";
}

function seleccionarHorario(medico, dia, hora, modalidad, btnId) {
  document.querySelectorAll(".btn-horario").forEach(function (b) {
    b.className = "btn btn-sm btn-primary btn-horario";
    b.textContent = "Seleccionar";
  });
  var btn = document.getElementById(btnId);
  btn.className = "btn btn-sm btn-success btn-horario";
  btn.textContent = "✓ Seleccionado";

  citaEnCurso.medico = medico;
  citaEnCurso.dia = dia;
  citaEnCurso.horaSlot = hora;
  citaEnCurso.modalidad = modalidad;
  document.getElementById("btnRegistrar").disabled = false;
}

function registrarCita() {
  if (!citaEnCurso.medico) {
    alert("Selecciona un horario primero.");
    return;
  }
  var citas = getCitas();
  citaEnCurso.id = Date.now();
  citas.push(Object.assign({}, citaEnCurso));
  saveCitas(citas);
  bootstrap.Modal.getInstance(document.getElementById("modalCita")).hide();
  mostrarToast("Cita con " + citaEnCurso.medico + " registrada con éxito");
}

function getCitas() {
  return JSON.parse(localStorage.getItem("citas") || "[]");
}
function saveCitas(citas) {
  localStorage.setItem("citas", JSON.stringify(citas));
}

function renderizarCitas() {
  var lista = document.getElementById("listaCitas");
  var citas = getCitas();

  if (citas.length === 0) {
    lista.innerHTML =
      '<div class="col-12 text-center text-muted py-5">' +
      '<i class="bi bi-calendar-x" style="font-size:3rem"></i>' +
      '<p class="mt-2">No tienes citas registradas aún.</p></div>';
    return;
  }

  lista.innerHTML = citas
    .map(function (c, i) {
      return (
        '<div class="col-md-4 mb-3">' +
        '<div class="card shadow-sm h-100">' +
        '<div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">' +
        '<span class="fw-semibold small">' +
        c.servicio +
        "</span>" +
        '<span class="badge bg-white text-primary">' +
        c.modalidad +
        "</span></div>" +
        '<div class="card-body">' +
        '<h6 class="card-title mb-1">' +
        c.nombre +
        "</h6>" +
        '<p class="text-muted small mb-1">DNI: ' +
        c.dni +
        " &nbsp;|&nbsp; Edad: " +
        c.edad +
        "</p>" +
        '<p class="small mb-1"><i class="bi bi-person-badge"></i> ' +
        c.medico +
        "</p>" +
        '<p class="small mb-0"><i class="bi bi-clock"></i> ' +
        c.dia +
        " · " +
        c.horaSlot +
        "</p></div>" +
        '<div class="card-footer d-flex gap-2">' +
        '<button class="btn btn-sm btn-outline-primary flex-fill" onclick="verDetalle(' +
        i +
        ')"><i class="bi bi-info-circle"></i> Ver detalle</button>' +
        '<button class="btn btn-sm btn-outline-danger flex-fill" onclick="eliminarCita(' +
        i +
        ')"><i class="bi bi-trash"></i> Cancelar</button>' +
        "</div></div></div>"
      );
    })
    .join("");
}

function verDetalle(index) {
  var c = getCitas()[index];
  var badgeClass =
    c.modalidad === "Presencial" ? "bg-success" : "bg-info text-dark";
  document.getElementById("detalleContenido").innerHTML =
    '<table class="table table-bordered table-sm mb-0">' +
    '<tr><td class="text-muted" style="width:40%">Paciente</td><td><strong>' +
    c.nombre +
    "</strong></td></tr>" +
    '<tr><td class="text-muted">DNI</td><td>' +
    c.dni +
    "</td></tr>" +
    '<tr><td class="text-muted">Edad</td><td>' +
    c.edad +
    " años</td></tr>" +
    '<tr><td class="text-muted">Parentesco</td><td>' +
    c.parentesco +
    "</td></tr>" +
    '<tr><td class="text-muted">Servicio</td><td>' +
    c.servicio +
    "</td></tr>" +
    '<tr><td class="text-muted">Médico</td><td>' +
    c.medico +
    "</td></tr>" +
    '<tr><td class="text-muted">Día</td><td>' +
    c.dia +
    "</td></tr>" +
    '<tr><td class="text-muted">Horario</td><td>' +
    c.horaSlot +
    "</td></tr>" +
    '<tr><td class="text-muted">Modalidad</td><td><span class="badge ' +
    badgeClass +
    '">' +
    c.modalidad +
    "</span></td></tr>" +
    "</table>";
  new bootstrap.Modal(document.getElementById("modalDetalle")).show();
}

function eliminarCita(index) {
  if (!confirm("¿Deseas cancelar esta cita?")) return;
  var citas = getCitas();
  citas.splice(index, 1);
  saveCitas(citas);
  renderizarCitas();
}

function mostrarToast(msg) {
  document.getElementById("toastMsg").textContent = msg;
  new bootstrap.Toast(document.getElementById("toastExito")).show();
}

document.addEventListener("DOMContentLoaded", function () {
  var modalEl = document.getElementById("modalCita");
  modalEl.addEventListener("show.bs.modal", function () {
    citaEnCurso = {};
    document.getElementById("inp_nombre").value = "";
    document.getElementById("inp_dni").value = "";
    document.getElementById("inp_edad").value = "";
    document.getElementById("inp_parentesco").value = "";
    irAPaso(0);
  });
});
