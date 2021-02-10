import type { Request, Response } from 'express'

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

//TODO: src/src/resolvers/post.ts(9,36): error TS2307: Cannot find module 'src/types' or its corresponding type declarations.
