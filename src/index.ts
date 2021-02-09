import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from 'type-graphql'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { ApolloContext } from './types'
import cors from 'cors'
import { createConnection } from 'typeorm'
import { applyMiddleware } from 'graphql-middleware'
import authMiddlewares from './middleware/authmiddleware'
import wasm from './wasm'
import dotenv from 'dotenv'

const __ISDEV__ = process.env.NODE_ENV?.trim() === 'development'

dotenv.config({ path: './env', debug: __ISDEV__ })

const main = async () => {
  await createConnection()

  const app = express()
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

  const RedisStore = connectRedis(session)
  const RedisClient = redis.createClient({ host: 'redis' })
  app.use(
    session({
      store: new RedisStore({
        client: RedisClient,
        disableTTL: true,
        disableTouch: true,
      }),
      saveUninitialized: true,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 day
        httpOnly: !__ISDEV__,
        secure: !__ISDEV__,
        sameSite: 'lax',
      },
      name: 'dm',
      secret: process.env.COOKIE_SECRET || 'snydxhh',
      resave: false,
    })
  )

  const schema = await buildSchema({
    resolvers: [__dirname + '/resolvers/*.{ts,js}'],
    validate: false,
    authMode: 'null',
  })

  new ApolloServer({
    schema: __ISDEV__
      ? applyMiddleware(schema)
      : applyMiddleware(schema, authMiddlewares),
    context: ({ req, res }): ApolloContext => ({ req, res }),
    debug: __ISDEV__,
    playground: __ISDEV__ || { settings: { 'request.credentials': 'include' } },
  }).applyMiddleware({ app, cors: false })

  app.use(express.json())
  app.post('/wasm', wasm)
  app.get('/', (_, res) => res.send('ok'))

  app.listen(process.env.BACKEND_PORT || 4000, () => {
    console.log(
      `[${process.env.NODE_ENV}] 🚀 Server ready at http://localhost:${process.env.BACKEND_PORT}/graphql`
    )
  })
}

main().catch((error) => {
  console.error(error)
  // process.exit(1);
})
