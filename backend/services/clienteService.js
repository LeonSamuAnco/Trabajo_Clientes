// services/clienteService.js
const clienteModel = require("../models/clienteModel")

class ClienteService {
  // Obtener todos los clientes
  async getClientes() {
    return await clienteModel.getAllClientes()
  }

  // Obtener un cliente por ID
  async getCliente(id) {
    return await clienteModel.getClienteById(id)
  }

  // Obtener un cliente por DNI
  async getClienteByDni(dni) {
    return await clienteModel.getClienteByDni(dni)
  }

  // Añadir un nuevo cliente
  async addCliente(clienteData) {
    return await clienteModel.createCliente(clienteData)
  }

  // Modificar un cliente existente
  async modifyCliente(id, clienteData) {
    return await clienteModel.updateCliente(id, clienteData)
  }

  // Eliminar un cliente
  async removeCliente(id) {
    return await clienteModel.deleteCliente(id)
  }
}

module.exports = new ClienteService()
