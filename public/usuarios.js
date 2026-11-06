const API = '/api/users';
const API_CREAR = '/api/users/register';   
const $ = (id) => document.getElementById(id);

const modalUsuario = new bootstrap.Modal($('modalUsuario'));
const modalBorrar  = new bootstrap.Modal($('modalBorrar'));
let usuarioABorrar = null;



function alerta(texto, tipo = 'success') {
  const div = document.createElement('div');
  div.className = `alert alert-${tipo} alert-dismissible fade show`;
  div.setAttribute('role', 'alert');
  div.textContent = texto;

  const cerrar = document.createElement('button');
  cerrar.type = 'button';
  cerrar.className = 'btn-close';
  cerrar.setAttribute('data-bs-dismiss', 'alert');
  cerrar.setAttribute('aria-label', 'Cerrar');
  div.appendChild(cerrar);

  $('alertas').appendChild(div);
  setTimeout(() => bootstrap.Alert.getOrCreateInstance(div).close(), 4000);
}

async function pedir(url, opciones = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opciones
  });

  const texto = await res.text();
  let datos = null;
  try { datos = texto ? JSON.parse(texto) : null; } catch { }

  if (!res.ok) {
    throw new Error(datos?.error || `Error ${res.status}`);
  }
  return datos;
}

function celda(texto) {
  const td = document.createElement('td');
  td.textContent = texto;
  return td;
}

function filaMensaje(texto) {
  const tr = document.createElement('tr');
  const td = document.createElement('td');
  td.colSpan = 4;
  td.className = 'text-center text-muted py-4';
  td.textContent = texto;
  tr.appendChild(td);
  return tr;
}



async function cargar() {
  const tbody = $('tabla');
  tbody.replaceChildren(filaMensaje('Cargando...'));

  try {
    const usuarios = await pedir(API);
    tbody.replaceChildren();

    if (usuarios.length === 0) {
      tbody.appendChild(filaMensaje('No hay usuarios registrados'));
      return;
    }

    usuarios.forEach((u) => {
      const tr = document.createElement('tr');
      tr.append(celda(u.id), celda(u.nombre), celda(u.email));

      const tdAcc = document.createElement('td');
      tdAcc.className = 'text-end text-nowrap';

      const btnEditar = document.createElement('button');
      btnEditar.type = 'button';
      btnEditar.className = 'btn btn-sm btn-outline-warning me-1';
      btnEditar.textContent = 'Editar';
      btnEditar.addEventListener('click', () => abrirEditar(u));

      const btnBorrar = document.createElement('button');
      btnBorrar.type = 'button';
      btnBorrar.className = 'btn btn-sm btn-outline-danger';
      btnBorrar.textContent = 'Eliminar';
      btnBorrar.addEventListener('click', () => abrirBorrar(u));

      tdAcc.append(btnEditar, btnBorrar);
      tr.appendChild(tdAcc);
      tbody.appendChild(tr);
    });
  } catch (err) {
    tbody.replaceChildren(filaMensaje('No se pudo cargar la lista'));
    alerta(err.message, 'danger');
  }
}



function prepararFormulario(titulo, textoBoton, ayuda) {
  $('formUsuario').reset();
  $('formUsuario').classList.remove('was-validated');
  $('errorForm').classList.add('d-none');
  $('tituloModal').textContent = titulo;
  $('btnGuardar').textContent = textoBoton;
  $('ayudaPassword').textContent = ayuda;
}

function abrirNuevo() {
  prepararFormulario('Nuevo usuario', 'Crear', '');
  $('id').value = '';
  modalUsuario.show();
}

function abrirEditar(u) {
  prepararFormulario(`Editar usuario #${u.id}`, 'Guardar cambios',
    'Ingresa la contraseña (nueva o actual) para guardar los cambios.');
  $('id').value = u.id;
  $('name').value = u.nombre;
  $('email').value = u.email;
  modalUsuario.show();
}

$('btnNuevo').addEventListener('click', abrirNuevo);

$('formUsuario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  form.classList.add('was-validated');
  if (!form.checkValidity()) return;

  const id = $('id').value;
  const cuerpo = JSON.stringify({
    nombre: $('name').value.trim(),
    email: $('email').value.trim(),
    contrasena: $('password').value
  });

  $('btnGuardar').disabled = true;
  try {
    if (id) {
      await pedir(`${API}/${id}`, { method: 'PUT', body: cuerpo });
      alerta('Usuario actualizado');
    } else {
      await pedir(API_CREAR, { method: 'POST', body: cuerpo });
      alerta('Usuario creado');
    }
    modalUsuario.hide();
    cargar();
  } catch (err) {
    $('errorForm').textContent = err.message;
    $('errorForm').classList.remove('d-none');
  } finally {
    $('btnGuardar').disabled = false;
  }
});


function abrirBorrar(u) {
  usuarioABorrar = u;
  $('nombreBorrar').textContent = u.nombre;
  modalBorrar.show();
}

$('btnConfirmarBorrar').addEventListener('click', async () => {
  if (!usuarioABorrar) return;

  try {
    await pedir(`${API}/${usuarioABorrar.id}`, { method: 'DELETE' });
    alerta('Usuario eliminado');
  } catch (err) {
    alerta(err.message, 'danger');
  } finally {
    usuarioABorrar = null;
    modalBorrar.hide();
    cargar();
  }
});

cargar();