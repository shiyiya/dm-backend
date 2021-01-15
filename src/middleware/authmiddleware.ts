import { or, rule, shield } from 'graphql-shield'
import User from '../entities/User'
import { ApolloContext } from '../types'

const authMap = {
  hasLogin: rule()((_parent, _args, ctx: ApolloContext) => {
    console.log('==== haslogin ====')
    return !!ctx.req.session.userId
  }),

  isWriter: rule()(async (_parent, _args, ctx: ApolloContext) => {
    console.log('==== iswriter ====')
    return (await User.findOne(ctx.req.session.userId))?.roleLevel == 1
  }),

  isAdmin: rule()(async (_parent, _args, ctx: ApolloContext) => {
    console.log('==== isadmin ====')

    return (await User.findOne(ctx.req.session.userId))?.roleLevel == 0
  }),

  ignore: rule()(() => true),
}

const authMiddlewares = shield({
  Query: {
    '*': authMap.hasLogin,
  },
  Mutation: {
    login: authMap.ignore,
    logout: authMap.ignore,
    register: authMap.ignore,
    queryPosts: authMap.ignore,
    createPost: or(authMap.isWriter, authMap.isAdmin),
    updatePost: or(authMap.isWriter, authMap.isAdmin),
    '*': authMap.hasLogin,
  },
})

export default authMiddlewares
