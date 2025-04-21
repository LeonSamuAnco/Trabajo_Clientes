// controllers/clienteController.js

const clienteService = require("../services/clienteService")
const ErrorHandler = require("../utils/errorHandler")

class ClienteController {
  // Obtener todos los clientes
  async getClientes(req, res) {
    try {
      const clientes = await clienteService.getClientes()
      res.json(clientes)
    } catch (error) {
      ErrorHandler.handleError(res, ErrorHandler.CLIENTES_FETCH_ERROR, 500)
    }
  }

  // Obtener un cliente por ID
  async getClienteById(req, res) {
    const { id } = req.params
    try {
      const cliente = await clienteService.getCliente(id)
      if (!cliente) {
        return ErrorHandler.handleError(res, ErrorHandler.CLIENTE_NOT_FOUND, 404)
      }
      res.json(cliente)
    } catch (error) {
      ErrorHandler.handleError(res, ErrorHandler.CLIENTE_FETCH_ERROR, 500)
    }
  }

  // Obtener un cliente por DNI
  async getClienteByDni(req, res) {
    const { dni } = req.params

    // Validar DNI
    const dniError = ErrorHandler.validateDni(dni)
    if (dniError) {
      return ErrorHandler.handleError(res, dniError, 400)
    }

    try {
      const cliente = await clienteService.getClienteByDni(dni)
      if (!cliente) {
        return ErrorHandler.handleError(res, ErrorHandler.CLIENTE_NOT_FOUND, 404)
      }
      res.json(cliente)
    } catch (error) {
      ErrorHandler.handleError(res, ErrorHandler.CLIENTE_FETCH_ERROR, 500)
    }
  }

  // Crear un nuevo cliente
  async createCliente(req, res) {
    try {
      const { dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento } = req.body

      // Validar todos los campos del cliente
      const clienteData = { dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento }
      const validationErrors = ErrorHandler.validateCliente(clienteData)

      if (validationErrors) {
        return ErrorHandler.handleError(res, validationErrors, 400)
      }

      // Verificar si ya existe un cliente con ese DNI
      const existingCliente = await clienteService.getClienteByDni(dni)
      if (existingCliente) {
        return ErrorHandler.handleError(res, ErrorHandler.CLIENTE_ALREADY_EXISTS, 409) // 409 Conflict
      }

      const newCliente = await clienteService.addCliente(clienteData)
      res.status(201).json(newCliente)
    } catch (error) {
      ErrorHandler.handleError(res, ErrorHandler.CLIENTE_CREATE_ERROR, 500)
    }
  }

  // Actualizar un cliente existente
  async updateCliente(req, res) {
    try {
      const { id } = req.params
      const { dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento } = req.body

      // Validar todos los campos del cliente
      const clienteData = { dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento }
      const validationErrors = ErrorHandler.validateCliente(clienteData)

      if (validationErrors) {
        return ErrorHandler.handleError(res, validationErrors, 400)
      }

      // Verificar si el cliente existe
      const existingCliente = await clienteService.getCliente(id)
      if (!existingCliente) {
        return ErrorHandler.handleError(res, ErrorHandler.CLIENTE_NOT_FOUND, 404)
      }

      // Verificar si el nuevo DNI ya está en uso por otro cliente
      if (dni !== existingCliente.dni) {
        const clienteWithDni = await clienteService.getClienteByDni(dni)
        if (clienteWithDni && clienteWithDni.id !== Number.parseInt(id)) {
          return ErrorHandler.handleError(res, ErrorHandler.CLIENTE_ALREADY_EXISTS, 409)
        }
      }

      const updateCliente = await clienteService.modifyCliente(id, clienteData)
      res.json(updateCliente)
    } catch (error) {
      ErrorHandler.handleError(res, ErrorHandler.CLIENTE_UPDATE_ERROR, 500)
    }
  }

  // Eliminar un cliente
  async deleteCliente(req, res) {
    try {
      const { id } = req.params

      // Verificar si el cliente existe
      const existingCliente = await clienteService.getCliente(id)
      if (!existingCliente) {
        return ErrorHandler.handleError(res, ErrorHandler.CLIENTE_NOT_FOUND, 404)
      }

      await clienteService.removeCliente(id)
      res.json({ message: "Cliente eliminado correctamente" })
    } catch (error) {
      ErrorHandler.handleError(res, ErrorHandler.CLIENTE_DELETE_ERROR, 500)
    }
  }
}

module.exports = new ClienteController()
