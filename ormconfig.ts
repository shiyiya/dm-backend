const __ISDEV__ = process.env.NODE_ENV
  ? process.env.NODE_ENV.trim() === 'development'
  : true

module.exports = {
  type: 'mysql',
  host: __ISDEV__ ? 'localhost' : 'db', //docker -> db
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'dm',
  entities: __ISDEV__ ? ['./src/entities/*.ts'] : ['./dist/src/entities/*.js'],
  migrations: __ISDEV__
    ? ['./src/migrations/*.ts']
    : ['./dist/src/migrations/*.ts'],
  cli: {
    migrationsDir: 'migration',
  },
  logging: true,
  synchronize: true,
}
