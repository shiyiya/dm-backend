const path = require('path')

module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'dm',
  entities: ['./src/entities/*.ts'],
  migrations: ['./src/migrations/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
  logging: true,
  synchronize: true,
}
