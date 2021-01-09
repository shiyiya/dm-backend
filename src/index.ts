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

const main = async () => {
  await createConnection()

  const app = express()
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

  const RedisStore = connectRedis(session)
  const RedisClient = redis.createClient()
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
        httpOnly: true,
        secure: false, // production -> true
        sameSite: 'lax',
      },
      name: 'dm',
      secret: 'dmsecret',
      resave: false,
    })
  )

  new ApolloServer({
    schema: applyMiddleware(
      await buildSchema({
        resolvers: [__dirname + '/resolvers/*.{ts,js}'],
        validate: false, //
        authMode: 'null',
      }),
      authMiddlewares
    ),
    context: ({ req, res }): ApolloContext => ({ req, res }),
    debug: true,
    playground: true,
  }).applyMiddleware({ app, cors: false })

  app.use(express.json())
  app.post('/wasm', wasm)

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000/graphql`)
  })
}

main().catch((error) => {
  console.error(error)
})
