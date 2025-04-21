// Importamos la conexión a la base de datos desde el archivo de configuración
const db = require("../config/db")

// Definimos la clase ClienteModel que contiene métodos para interactuar con la base de datos
class ClienteModel {
  // Método para obtener todos los registros de la tabla 'clientes'
  async getAllClientes() {
    const result = await db.query("SELECT * FROM clientes")
    return result.rows // Retorna todos los registros como un arreglo
  }

  // Método para obtener un único cliente según su ID
  async getClienteById(id) {
    const result = await db.query("SELECT * FROM clientes WHERE id = $1", [id])
    return result.rows[0] // Retorna solo el primer (y único) resultado
  }

  // Método para obtener un cliente por su DNI
  async getClienteByDni(dni) {
    const result = await db.query("SELECT * FROM clientes WHERE dni = $1", [dni])
    return result.rows[0] // Retorna solo el primer (y único) resultado
  }

  // Método para insertar un nuevo cliente en la base de datos
  async createCliente({ dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento }) {
    const result = await db.query(
      // Utiliza placeholders ($1, $2, $3, $4, $5) para evitar inyecciones SQL
      "INSERT INTO clientes (dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento], // Valores a insertar
    )
    return result.rows[0] // Retorna el nuevo registro insertado
  }

  // Método para actualizar un cliente existente en base a su ID
  async updateCliente(id, { dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento }) {
    const result = await db.query(
      // Actualiza los campos especificados en el registro que coincida con el ID
      "UPDATE clientes SET dni = $1, nombre = $2, apellido_paterno = $3, apellido_materno = $4, fecha_nacimiento = $5 WHERE id = $6 RETURNING *",
      [dni, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, id], // Nuevos valores y el ID del cliente
    )
    return result.rows[0] // Retorna el registro actualizado
  }

  // Método para eliminar un cliente por su ID
  async deleteCliente(id) {
    await db.query("DELETE FROM clientes WHERE id = $1", [id])
    // No es necesario retornar nada, ya que solo se elimina el registro
  }
}

// Exportamos una instancia de la clase para poder usar sus métodos directamente
module.exports = new ClienteModel()
