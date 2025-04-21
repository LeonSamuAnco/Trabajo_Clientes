/**
 * Clase para manejar errores específicos de la aplicación
 * Centraliza los mensajes de error y facilita su gestión
 */
class ErrorHandler {
    // Errores relacionados con la base de datos
    static DB_CONNECTION_ERROR = "Error de conexión a la base de datos"
    static DB_QUERY_ERROR = "Error al ejecutar la consulta en la base de datos"
  
    // Errores relacionados con clientes
    static CLIENTE_NOT_FOUND = "Cliente no encontrado"
    static CLIENTE_ALREADY_EXISTS = "Ya existe un cliente con ese DNI"
    static CLIENTE_INVALID_DATA = "Datos de cliente inválidos"
  
    // Errores específicos por campo
    static CLIENTE_INVALID_DNI = "El DNI proporcionado no es válido"
    static CLIENTE_INVALID_NOMBRE = "El nombre proporcionado no es válido"
    static CLIENTE_INVALID_APELLIDO = "El apellido proporcionado no es válido"
    static CLIENTE_INVALID_FECHA = "La fecha de nacimiento proporcionada no es válida"
  
    // Errores de operaciones CRUD
    static CLIENTE_CREATE_ERROR = "Error al crear el cliente"
    static CLIENTE_UPDATE_ERROR = "Error al actualizar el cliente"
    static CLIENTE_DELETE_ERROR = "Error al eliminar el cliente"
    static CLIENTE_FETCH_ERROR = "Error al obtener los datos del cliente"
    static CLIENTES_FETCH_ERROR = "Error al obtener la lista de clientes"
  
    // Errores de validación
    static validateDni(dni) {
      if (!dni || dni.length < 8) {
        return this.CLIENTE_INVALID_DNI
      }
      return null
    }
  
    static validateNombre(nombre) {
      if (!nombre || nombre.trim() === "") {
        return this.CLIENTE_INVALID_NOMBRE
      }
      return null
    }
  
    static validateApellido(apellido, tipo) {
      if (!apellido || apellido.trim() === "") {
        return `El apellido ${tipo} proporcionado no es válido`
      }
      return null
    }
  
    static validateFechaNacimiento(fecha) {
      if (!fecha) {
        return this.CLIENTE_INVALID_FECHA
      }
  
      const fechaObj = new Date(fecha)
      if (isNaN(fechaObj.getTime())) {
        return this.CLIENTE_INVALID_FECHA
      }
  
      // Verificar que la fecha no sea futura
      if (fechaObj > new Date()) {
        return "La fecha de nacimiento no puede ser futura"
      }
  
      return null
    }
  
    // Método para validar todos los campos de un cliente
    static validateCliente(cliente) {
      const errors = []
  
      const dniError = this.validateDni(cliente.dni)
      if (dniError) errors.push(dniError)
  
      const nombreError = this.validateNombre(cliente.nombre)
      if (nombreError) errors.push(nombreError)
  
      const apellidoPaternoError = this.validateApellido(cliente.apellido_paterno, "paterno")
      if (apellidoPaternoError) errors.push(apellidoPaternoError)
  
      const apellidoMaternoError = this.validateApellido(cliente.apellido_materno, "materno")
      if (apellidoMaternoError) errors.push(apellidoMaternoError)
  
      const fechaError = this.validateFechaNacimiento(cliente.fecha_nacimiento)
      if (fechaError) errors.push(fechaError)
  
      return errors.length > 0 ? errors : null
    }
  
    // Método para generar respuesta de error
    static handleError(res, error, statusCode = 500) {
      console.error("Error:", error)
  
      // Si es un error personalizado (string), lo devolvemos directamente
      if (typeof error === "string") {
        return res.status(statusCode).json({ message: error })
      }
  
      // Si es un array de errores, devolvemos todos los errores
      if (Array.isArray(error)) {
        return res.status(statusCode).json({ errors: error })
      }
  
      // Si es un error de sistema, devolvemos un mensaje genérico
      return res.status(statusCode).json({
        message: "Se produjo un error en el servidor",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    }
  }
  
  module.exports = ErrorHandler
  