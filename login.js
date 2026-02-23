/* ===== SCRIPT PARA PÁGINA DE LOGIN ===== */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  
  // Referencias a elementos
  const form = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const btnCliente = document.getElementById('btnCliente');
  const btnAdmin = document.getElementById('btnAdmin');
  
  // Variable para almacenar el tipo de usuario seleccionado
  let tipoUsuarioActual = 'cliente';

  /* ===== MANEJO DE SELECTOR DE TIPO DE USUARIO ===== */

  //Cambia el tipo de usuario seleccionado
  function cambiarTipoUsuario(tipo) {
    tipoUsuarioActual = tipo;

    // Actualizar clases de botones
    if (tipo === 'cliente') {
      btnCliente.classList.add('active');
      btnAdmin.classList.remove('active');
    } else {
      btnAdmin.classList.add('active');
      btnCliente.classList.remove('active');
    }

    // Limpiar mensajes de error
    MessageHandler.limpiarErrorCampo('username');
    MessageHandler.limpiarErrorCampo('password');
    document.getElementById('messageContainer').innerHTML = '';
  }

  // Event listeners para los botones de tipo de usuario
  btnCliente.addEventListener('click', function() {
    cambiarTipoUsuario('cliente');
  });

  btnAdmin.addEventListener('click', function() {
    cambiarTipoUsuario('admin');
  });

  /* ===== VALIDACIONES EN TIEMPO REAL ===== */

  // Valida el campo de username en tiempo real
  function validarUsername() {
    const username = usernameInput.value;
    
    if (username === '') {
      MessageHandler.limpiarErrorCampo('username');
      return;
    }

    const validacion = FormValidator.validarRequerido(username);

    if (!validacion.valid) {
      MessageHandler.mostrarErrorCampo('username', validacion.mensaje);
    } else {
      MessageHandler.marcarCampoValido('username');
    }
  }

  //Valida el campo de password en tiempo real 
  function validarPassword() {
    const password = passwordInput.value;
    
    if (password === '') {
      MessageHandler.limpiarErrorCampo('password');
      return;
    }

    const validacion = FormValidator.validarRequerido(password);

    if (!validacion.valid) {
      MessageHandler.mostrarErrorCampo('password', validacion.mensaje);
    } else {
      MessageHandler.marcarCampoValido('password');
    }
  }

  // Event listeners para validación en tiempo real
  usernameInput.addEventListener('input', validarUsername);
  usernameInput.addEventListener('blur', validarUsername);

  passwordInput.addEventListener('input', validarPassword);
  passwordInput.addEventListener('blur', validarPassword);

  /* ===== MANEJO DE ENVÍO DE FORMULARIO ===== */

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes previos
    document.getElementById('messageContainer').innerHTML = '';

    // Obtener valores
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Validar campos
    let formularioValido = true;

    // Validar username
    const valUsername = FormValidator.validarRequerido(username);
    if (!valUsername.valid) {
      MessageHandler.mostrarErrorCampo('username', valUsername.mensaje);
      formularioValido = false;
    }

    // Validar password
    const valPassword = FormValidator.validarRequerido(password);
    if (!valPassword.valid) {
      MessageHandler.mostrarErrorCampo('password', valPassword.mensaje);
      formularioValido = false;
    }

    if (!formularioValido) {
      MessageHandler.mostrarMensaje(
        'messageContainer', 
        'Por favor completa todos los campos.', 
        'error'
      );
      return;
    }

    // Intentar iniciar sesión
    const resultado = userManager.iniciarSesion(username, password, tipoUsuarioActual);

    if (resultado.success) {
      // Mostrar mensaje de éxito
      MessageHandler.mostrarMensaje(
        'messageContainer', 
        resultado.mensaje, 
        'success'
      );

      // Guardar sesión
      userManager.guardarSesion(resultado.usuario);

      // Limpiar formulario
      form.reset();
      MessageHandler.limpiarErrorCampo('username');
      MessageHandler.limpiarErrorCampo('password');

      setTimeout(() => {
      if (resultado.usuario.tipo === 'admin') {
      window.location.href = 'admin.html';
      } else {
      MessageHandler.mostrarMensaje(
      'messageContainer',
      'Panel de cliente en desarrollo. Sesión iniciada correctamente.',
      'info',
      0
    );
    // window.location.href = 'cliente-panel.html';
  }
}, 1500);

    } else {
      // Mostrar mensaje de error
      MessageHandler.mostrarMensaje(
        'messageContainer', 
        resultado.mensaje, 
        'error'
      );
    }
  });

  /* ===== VERIFICAR SI YA HAY UNA SESIÓN ACTIVA ===== */
  
  const sesionActual = userManager.obtenerSesionActual();
  if (sesionActual) {
    MessageHandler.mostrarMensaje(
      'messageContainer',
      `Ya tienes una sesión activa como ${sesionActual.nombre || sesionActual.username}. ` +
      `<a href="#" onclick="userManager.cerrarSesion(); location.reload();">Cerrar sesión</a>`,
      'info',
      0
    );
  }

});