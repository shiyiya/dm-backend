import { Request, Response } from 'express'

export type ApolloContext = {
  req: Request
  res: Response
}

declare module 'express-session' {
  interface SessionData {
    userId?: string
    token?: string
  }
}

export enum RoleLevel {
  ADMIN = 0,
  GUEST = 1,
  WRITER = 2,
}
