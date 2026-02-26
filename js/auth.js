/* ===== Autenticación de usuario ===== */

/**
 * Clase para gestionar usuarios en localStorage
 */
class UserManager {
  constructor() {
    this.STORAGE_KEY = 'mundoGadget_usuarios';
    this.ADMIN_CREDENTIALS = {
      username: 'admin',
      password: 'Admin123!'
    };
  }

  /**
   * Obtiene todos los usuarios del localStorage
   * @returns {Array} Array de usuarios
   */
  obtenerUsuarios() {
    const usuarios = localStorage.getItem(this.STORAGE_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
  }

  /**
   * Guarda el array de usuarios en localStorage
   * @param {Array} usuarios - Array de usuarios a guardar
   */
  guardarUsuarios(usuarios) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuarios));
  }

  /**
   * Verifica si un nombre de usuario ya existe
   * @param {string} username - Nombre de usuario a verificar
   * @returns {boolean} true si existe, false si no
   */
  existeUsuario(username) {
    const usuarios = this.obtenerUsuarios();
    return usuarios.some(usuario => 
      usuario.username.toLowerCase() === username.toLowerCase()
    );
  }

  /**
   * Registra un nuevo usuario
   * @param {Object} datosUsuario - Datos del usuario a registrar
   * @returns {Object} Objeto con success y mensaje
   */
  registrarUsuario(datosUsuario) {
    // Verificar que no exista el usuario
    if (this.existeUsuario(datosUsuario.username)) {
      return {
        success: false,
        mensaje: 'El nombre de usuario ya está en uso. Por favor elige otro.'
      };
    }

    // Crear objeto de usuario
    const nuevoUsuario = {
      id: this.generarId(),
      nombre: datosUsuario.nombre,
      apellido: datosUsuario.apellido,
      username: datosUsuario.username,
      password: datosUsuario.password, // En producción, esto debería estar hasheado
      telefono: datosUsuario.telefono,
      email: datosUsuario.email,
      fechaRegistro: new Date().toISOString(),
      tipo: 'cliente'
    };

    // Agregar a la lista de usuarios
    const usuarios = this.obtenerUsuarios();
    usuarios.push(nuevoUsuario);
    this.guardarUsuarios(usuarios);

    return {
      success: true,
      mensaje: '¡Registro exitoso! Bienvenido a Mundo Gadget.',
      usuario: nuevoUsuario
    };
  }

  /**
   * Genera un ID único para el usuario
   * @returns {string} ID único
   */
  generarId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Valida las credenciales de inicio de sesión
   * @param {string} username - Nombre de usuario
   * @param {string} password - Contraseña
   * @param {string} tipoUsuario - 'cliente' o 'admin'
   * @returns {Object} Objeto con success, mensaje y usuario (si aplica)
   */
  iniciarSesion(username, password, tipoUsuario = 'cliente') {
    // Validar admin
    if (tipoUsuario === 'admin') {
      if (username === this.ADMIN_CREDENTIALS.username && 
          password === this.ADMIN_CREDENTIALS.password) {
        return {
          success: true,
          mensaje: '¡Bienvenido, Administrador!',
          usuario: {
            username: 'admin',
            tipo: 'admin',
            nombre: 'Administrador'
          }
        };
      } else {
        return {
          success: false,
          mensaje: 'Credenciales de administrador incorrectas.'
        };
      }
    }

    // Validar cliente
    const usuarios = this.obtenerUsuarios();
    const usuario = usuarios.find(u => 
      u.username.toLowerCase() === username.toLowerCase()
    );

    if (!usuario) {
      return {
        success: false,
        mensaje: 'Usuario no encontrado. Verifica tu nombre de usuario.'
      };
    }

    if (usuario.password !== password) {
      return {
        success: false,
        mensaje: 'Contraseña incorrecta. Inténtalo de nuevo.'
      };
    }

    return {
      success: true,
      mensaje: `¡Bienvenido de nuevo, ${usuario.nombre}!`,
      usuario: usuario
    };
  }

  /**
   * Guarda la sesión actual del usuario
   * @param {Object} usuario - Datos del usuario
   */
  guardarSesion(usuario) {
    localStorage.setItem('mundoGadget_sesionActual', JSON.stringify(usuario));
  }

  /**
   * Obtiene la sesión actual del usuario
   * @returns {Object|null} Datos del usuario o null
   */
  obtenerSesionActual() {
    const sesion = localStorage.getItem('mundoGadget_sesionActual');
    return sesion ? JSON.parse(sesion) : null;
  }

  // Cierra la sesión actual
  cerrarSesion() {
    localStorage.removeItem('mundoGadget_sesionActual');
  }
}

// Clase para validaciones de formularios
class FormValidator {
  /**
   * Valida que un campo no esté vacío
   * @param {string} valor - Valor a validar
   * @returns {Object} Objeto con valid y mensaje
   */
  static validarRequerido(valor) {
    const esValido = valor && valor.trim() !== '';
    return {
      valid: esValido,
      mensaje: esValido ? '' : 'Este campo es requerido.'
    };
  }

  /**
   * Valida formato de email
   * @param {string} email - Email a validar
   * @returns {Object} Objeto con valid y mensaje
   */
  static validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const esValido = regex.test(email);
    return {
      valid: esValido,
      mensaje: esValido ? '' : 'Formato de correo electrónico inválido.'
    };
  }

  /**
   * Valida formato de teléfono (El Salvador)
   * @param {string} telefono - Teléfono a validar
   * @returns {Object} Objeto con valid y mensaje
   */
  static validarTelefono(telefono) {
    // Acepta formatos: 7890-1234, 78901234, 2234-5678
    const regex = /^\d{4}-?\d{4}$/;
    const esValido = regex.test(telefono);
    return {
      valid: esValido,
      mensaje: esValido ? '' : 'Formato de teléfono inválido. Use: 7890-1234'
    };
  }

  /**
   * Valida contraseña segura
   * Requisitos: mínimo 6 caracteres, 1 mayúscula, 1 número, 1 carácter especial
   * @param {string} password - Contraseña a validar
   * @returns {Object} Objeto con valid, mensaje y requirements
   */
  static validarPassword(password) {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const todasCumplidas = Object.values(requirements).every(req => req);

    let mensaje = '';
    if (!requirements.length) mensaje = 'La contraseña debe tener mínimo 6 caracteres.';
    else if (!requirements.uppercase) mensaje = 'Debe incluir al menos 1 letra mayúscula.';
    else if (!requirements.number) mensaje = 'Debe incluir al menos 1 número.';
    else if (!requirements.special) mensaje = 'Debe incluir al menos 1 carácter especial (!@#$%^&*).';

    return {
      valid: todasCumplidas,
      mensaje: mensaje,
      requirements: requirements
    };
  }

  /**
   * Valida que las contraseñas coincidan
   * @param {string} password - Contraseña original
   * @param {string} confirmPassword - Contraseña de confirmación
   * @returns {Object} Objeto con valid y mensaje
   */
  static validarPasswordsCoinciden(password, confirmPassword) {
    const esValido = password === confirmPassword;
    return {
      valid: esValido,
      mensaje: esValido ? '' : 'Las contraseñas no coinciden.'
    };
  }
}

/**
 * Mostrar mensajes
 */
class MessageHandler {
  /**
   * Muestra un mensaje en el contenedor especificado
   * @param {string} containerId - ID del contenedor
   * @param {string} mensaje - Texto del mensaje
   * @param {string} tipo - 'success', 'error', o 'info'
   * @param {number} duracion - Duración en ms (0 = permanente)
   */
  static mostrarMensaje(containerId, mensaje, tipo = 'info', duracion = 5000) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}`;
    messageDiv.textContent = mensaje;

    // Limpiar mensajes anteriores
    container.innerHTML = '';

    // Agregar nuevo mensaje
    container.appendChild(messageDiv);

    // Auto-ocultar si se especifica duración
    if (duracion > 0) {
      setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
      }, duracion);
    }
  }

  /**
   * Muestra un error en un campo específico
   * @param {string} fieldId - ID del campo
   * @param {string} mensaje - Mensaje de error
   */
  static mostrarErrorCampo(fieldId, mensaje) {
    const errorSpan = document.getElementById(`${fieldId}Error`);
    const inputField = document.getElementById(fieldId);

    if (errorSpan && mensaje) {
      errorSpan.textContent = mensaje;
      errorSpan.classList.add('show');
    }

    if (inputField) {
      inputField.classList.add('invalid');
      inputField.classList.remove('valid');
    }
  }

  /**
   * Limpia el error de un campo específico
   * @param {string} fieldId - ID del campo
   */
  static limpiarErrorCampo(fieldId) {
    const errorSpan = document.getElementById(`${fieldId}Error`);
    const inputField = document.getElementById(fieldId);

    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('show');
    }

    if (inputField) {
      inputField.classList.remove('invalid');
    }
  }

  /**
   * Marca un campo como válido
   * @param {string} fieldId - ID del campo
   */
  static marcarCampoValido(fieldId) {
    const inputField = document.getElementById(fieldId);
    if (inputField) {
      inputField.classList.add('valid');
      inputField.classList.remove('invalid');
    }
    this.limpiarErrorCampo(fieldId);
  }
}

// Exportar instancia global de UserManager
const userManager = new UserManager();