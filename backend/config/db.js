const { Pool } = require("pg")

class Database {
  constructor() {
    this.pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "clientedb",
      password: "admin",
      port: 5435,
    })
  }

  query(text, params) {
    return this.pool.query(text, params)
  }
}

module.exports = new Database()
