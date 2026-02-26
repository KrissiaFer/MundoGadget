/* ===== PAGINA DE REGISTRO ===== */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  
  // Referencias a elementos del formulario
  const form = document.getElementById('registerForm');
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const telefonoInput = document.getElementById('telefono');
  const emailInput = document.getElementById('email');

  // Elementos de requisitos de contraseña
  const reqLength = document.getElementById('req-length');
  const reqUppercase = document.getElementById('req-uppercase');
  const reqNumber = document.getElementById('req-number');
  const reqSpecial = document.getElementById('req-special');

  /* ===== VALIDACIONES ===== */

   //Actualiza los indicadores de requisitos de contraseña
  function actualizarRequisitosPassword() {
    const password = passwordInput.value;
    const validacion = FormValidator.validarPassword(password);
    const reqs = validacion.requirements;

    // Actualizar cada requisito
    actualizarRequisitoUI(reqLength, reqs.length);
    actualizarRequisitoUI(reqUppercase, reqs.uppercase);
    actualizarRequisitoUI(reqNumber, reqs.number);
    actualizarRequisitoUI(reqSpecial, reqs.special);
  }

  //Actualiza la UI de un requisito específico
  function actualizarRequisitoUI(elemento, cumplido) {
    if (cumplido) {
      elemento.classList.add('valid');
      elemento.textContent = elemento.textContent.replace('✗', '✓');
    } else {
      elemento.classList.remove('valid');
      elemento.textContent = elemento.textContent.replace('✓', '✗');
    }
  }

  //Valida el campo de nombre en tiempo real
  function validarNombre() {
    const validacion = FormValidator.validarRequerido(nombreInput.value);
    if (!validacion.valid && nombreInput.value !== '') {
      MessageHandler.mostrarErrorCampo('nombre', validacion.mensaje);
    } else if (nombreInput.value !== '') {
      MessageHandler.marcarCampoValido('nombre');
    } else {
      MessageHandler.limpiarErrorCampo('nombre');
    }
  }

  
   //Valida el campo de apellido en tiempo real
  function validarApellido() {
    const validacion = FormValidator.validarRequerido(apellidoInput.value);
    if (!validacion.valid && apellidoInput.value !== '') {
      MessageHandler.mostrarErrorCampo('apellido', validacion.mensaje);
    } else if (apellidoInput.value !== '') {
      MessageHandler.marcarCampoValido('apellido');
    } else {
      MessageHandler.limpiarErrorCampo('apellido');
    }
  }

  
   //Valida el campo de username en tiempo real
   
  function validarUsername() {
    const username = usernameInput.value;
    
    // Validar si está vacío
    const validacionRequerido = FormValidator.validarRequerido(username);
    if (!validacionRequerido.valid && username !== '') {
      MessageHandler.mostrarErrorCampo('username', validacionRequerido.mensaje);
      return;
    }

    // Validar si ya existe
    if (username !== '') {
      if (userManager.existeUsuario(username)) {
        MessageHandler.mostrarErrorCampo('username', 'Este nombre de usuario ya está en uso.');
      } else {
        MessageHandler.marcarCampoValido('username');
      }
    } else {
      MessageHandler.limpiarErrorCampo('username');
    }
  }

   //Valida el campo de contraseña en tiempo real
  function validarPassword() {
    const password = passwordInput.value;
    
    if (password === '') {
      MessageHandler.limpiarErrorCampo('password');
      return;
    }

    const validacion = FormValidator.validarPassword(password);
    
    if (!validacion.valid) {
      MessageHandler.mostrarErrorCampo('password', validacion.mensaje);
    } else {
      MessageHandler.marcarCampoValido('password');
    }

    // Actualizar indicadores visuales
    actualizarRequisitosPassword();

    // Si existe confirmación, validarla también
    if (confirmPasswordInput.value !== '') {
      validarConfirmPassword();
    }
  }

  /**
   * Valida el campo de confirmación de contraseña
   */
  function validarConfirmPassword() {
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword === '') {
      MessageHandler.limpiarErrorCampo('confirmPassword');
      return;
    }

    const validacion = FormValidator.validarPasswordsCoinciden(
      passwordInput.value, 
      confirmPassword
    );

    if (!validacion.valid) {
      MessageHandler.mostrarErrorCampo('confirmPassword', validacion.mensaje);
    } else {
      MessageHandler.marcarCampoValido('confirmPassword');
    }
  }

  // Valida el campo de teléfono en tiempo real
  function validarTelefono() {
    const telefono = telefonoInput.value;
    
    if (telefono === '') {
      MessageHandler.limpiarErrorCampo('telefono');
      return;
    }

    const validacion = FormValidator.validarTelefono(telefono);

    if (!validacion.valid) {
      MessageHandler.mostrarErrorCampo('telefono', validacion.mensaje);
    } else {
      MessageHandler.marcarCampoValido('telefono');
    }
  }

  //Valida el campo de email en tiempo real
  function validarEmail() {
    const email = emailInput.value;
    
    if (email === '') {
      MessageHandler.limpiarErrorCampo('email');
      return;
    }

    const validacion = FormValidator.validarEmail(email);

    if (!validacion.valid) {
      MessageHandler.mostrarErrorCampo('email', validacion.mensaje);
    } else {
      MessageHandler.marcarCampoValido('email');
    }
  }

  /* ===== EVENT LISTENERS PARA VALIDACIÓN EN TIEMPO REAL ===== */
  
  nombreInput.addEventListener('input', validarNombre);
  nombreInput.addEventListener('blur', validarNombre);

  apellidoInput.addEventListener('input', validarApellido);
  apellidoInput.addEventListener('blur', validarApellido);

  usernameInput.addEventListener('input', validarUsername);
  usernameInput.addEventListener('blur', validarUsername);

  passwordInput.addEventListener('input', validarPassword);
  passwordInput.addEventListener('blur', validarPassword);

  confirmPasswordInput.addEventListener('input', validarConfirmPassword);
  confirmPasswordInput.addEventListener('blur', validarConfirmPassword);

  telefonoInput.addEventListener('input', validarTelefono);
  telefonoInput.addEventListener('blur', validarTelefono);

  emailInput.addEventListener('input', validarEmail);
  emailInput.addEventListener('blur', validarEmail);

  /* ===== MANEJO DE ENVÍO DE FORMULARIO ===== */

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Limpiar mensajes previos
    document.getElementById('messageContainer').innerHTML = '';

    // Obtener valores
    const datosUsuario = {
      nombre: nombreInput.value.trim(),
      apellido: apellidoInput.value.trim(),
      username: usernameInput.value.trim(),
      password: passwordInput.value,
      telefono: telefonoInput.value.trim(),
      email: emailInput.value.trim()
    };

    // Validar todos los campos
    let formularioValido = true;
    const validaciones = [];

    // Validar nombre
    const valNombre = FormValidator.validarRequerido(datosUsuario.nombre);
    if (!valNombre.valid) {
      MessageHandler.mostrarErrorCampo('nombre', valNombre.mensaje);
      formularioValido = false;
    }

    // Validar apellido
    const valApellido = FormValidator.validarRequerido(datosUsuario.apellido);
    if (!valApellido.valid) {
      MessageHandler.mostrarErrorCampo('apellido', valApellido.mensaje);
      formularioValido = false;
    }

    // Validar username
    const valUsername = FormValidator.validarRequerido(datosUsuario.username);
    if (!valUsername.valid) {
      MessageHandler.mostrarErrorCampo('username', valUsername.mensaje);
      formularioValido = false;
    } else if (userManager.existeUsuario(datosUsuario.username)) {
      MessageHandler.mostrarErrorCampo('username', 'Este nombre de usuario ya está en uso.');
      formularioValido = false;
    }

    // Validar password
    const valPassword = FormValidator.validarPassword(datosUsuario.password);
    if (!valPassword.valid) {
      MessageHandler.mostrarErrorCampo('password', valPassword.mensaje);
      formularioValido = false;
    }

    // Validar confirmación de password
    const valConfirm = FormValidator.validarPasswordsCoinciden(
      datosUsuario.password, 
      confirmPasswordInput.value
    );
    if (!valConfirm.valid) {
      MessageHandler.mostrarErrorCampo('confirmPassword', valConfirm.mensaje);
      formularioValido = false;
    }

    // Validar teléfono
    const valTelefono = FormValidator.validarTelefono(datosUsuario.telefono);
    if (!valTelefono.valid) {
      MessageHandler.mostrarErrorCampo('telefono', valTelefono.mensaje);
      formularioValido = false;
    }

    // Validar email
    const valEmail = FormValidator.validarEmail(datosUsuario.email);
    if (!valEmail.valid) {
      MessageHandler.mostrarErrorCampo('email', valEmail.mensaje);
      formularioValido = false;
    }

    // Si todo es válido, registrar usuario
    if (formularioValido) {
      const resultado = userManager.registrarUsuario(datosUsuario);

      if (resultado.success) {
        MessageHandler.mostrarMensaje(
          'messageContainer', 
          resultado.mensaje, 
          'success'
        );

        // Limpiar formulario
        form.reset();

        // Limpiar clases de validación
        document.querySelectorAll('.valid, .invalid').forEach(el => {
          el.classList.remove('valid', 'invalid');
        });

        // Resetear indicadores de contraseña
        actualizarRequisitosPassword();

        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        MessageHandler.mostrarMensaje(
          'messageContainer', 
          resultado.mensaje, 
          'error'
        );
      }
    } else {
      MessageHandler.mostrarMensaje(
        'messageContainer', 
        'Por favor corrige los errores en el formulario.', 
        'error'
      );
    }
  });

});