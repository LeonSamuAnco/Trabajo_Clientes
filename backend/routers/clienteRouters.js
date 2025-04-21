const express = require("express")
const router = express.Router()
const clienteController = require("../controllers/clienteController")

// Solicitud de tipo GET en la URL para obtener todos los clientes
router.get("/", (req, res) => clienteController.getClientes(req, res))

// Solicitud de tipo GET para buscar por DNI
router.get("/dni/:dni", (req, res) => clienteController.getClienteByDni(req, res))

// Solicitud de tipo GET para buscar por ID
router.get("/:id", (req, res) => clienteController.getClienteById(req, res))

// Solicitud de tipo POST en la URL
router.post("/", (req, res) => clienteController.createCliente(req, res))

// Solicitud de tipo PUT en la URL
router.put("/:id", (req, res) => clienteController.updateCliente(req, res))

// Solicitud de tipo DELETE en la URL
router.delete("/:id", (req, res) => clienteController.deleteCliente(req, res))

module.exports = router
