// Lógica principal del checklist
console.log('main.js cargado');
// main.js

let datosParciales = null;

function guardarParcial() {
  const header = getHeaderData();
  const actividades = getEvaluaciones();

  datosParciales = { encabezado: header, actividades };
  localStorage.setItem("checklistParcial", JSON.stringify(datosParciales));
  alert("Guardado parcial exitoso.");
}

function cargarParcial() {
  const datos = JSON.parse(localStorage.getItem("checklistParcial"));
  if (!datos) return;

  const h = datos.encabezado;
  document.getElementById("torre").value = h.torre;
  document.getElementById("fecha").value = h.fecha;
  document.getElementById("revision").value = h.revision;
  document.getElementById("empleado").value = h.empleado;
  document.getElementById("marca").value = h.marca;
  document.getElementById("tipo").value = h.tipo;
  document.getElementById("nivel").value = h.nivel;
  document.getElementById("serie").value = h.serie;
  document.getElementById("color").value = h.color;
  document.getElementById("zona").value = h.zona;

  document.getElementById("zona").dispatchEvent(new Event("change"));

  setTimeout(() => {
    datos.actividades.forEach(a => {
      document.querySelectorAll(`#zona-content tbody tr`).forEach(row => {
        if (row.dataset.subzona === a.subzona && row.dataset.actividad === a.actividad) {
          row.querySelectorAll("button").forEach(btn => {
            if (btn.dataset.type === a.tipo) {
              btn.classList.add("btn-active");
            }
          });
        }
      });
    });
  }, 300);
}

function guardarFinal() {
  const header = getHeaderData();
  const actividades = getEvaluaciones();

  const datos = actividades.map(a => ({
    Timestamp: new Date().toISOString(),
    Torre: header.torre,
    Fecha: header.fecha,
    Revision: header.revision,
    Empleado: header.empleado,
    Marca: header.marca,
    Tipo: header.tipo,
    Nivel: header.nivel,
    Serie: header.serie,
    Color: header.color,
    Zona: header.zona,
    Subzona: a.subzona,
    Actividad: a.actividad,
    Tipo: a.tipo,
    Valor: a.valor
  }));

  fetch("https://script.google.com/macros/s/AKfycbxYN32YlBts0m3J8DBE3mu5pfsYQa2cj-8FPP9925lGxWIatd8Ouc_zFZBelasjA273/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
  })
  .then(() => {
    alert("Datos enviados correctamente.");
    localStorage.removeItem("checklistParcial");
    limpiarFormulario();
  })
  .catch(err => alert("Error al enviar datos: " + err.message));
}

function getHeaderData() {
  return {
    torre: document.getElementById("torre").value,
    fecha: document.getElementById("fecha").value,
    revision: document.getElementById("revision").value,
    empleado: document.getElementById("empleado").value,
    marca: document.getElementById("marca").value,
    tipo: document.getElementById("tipo").value,
    nivel: document.getElementById("nivel").value,
    serie: document.getElementById("serie").value,
    color: document.getElementById("color").value,
    zona: document.getElementById("zona").value
  };
}

function getEvaluaciones() {
  const rows = document.querySelectorAll("#zona-content tbody tr");
  const actividades = [];

  rows.forEach(row => {
    const btn = row.querySelector(".btn-active");
    actividades.push({
      subzona: row.dataset.subzona,
      actividad: row.dataset.actividad,
      tipo: btn ? btn.dataset.type : "NO_EVALUADO",
      valor: btn ? btn.dataset.value : "0"
    });
  });

  return actividades;
}

function imprimirChecklist() {
  window.print();
}

function limpiarFormulario() {
  document.getElementById("header-form").reset();
  document.getElementById("zona").value = "";
  document.getElementById("zona-content").innerHTML = "";
}

