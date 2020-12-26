import User from '../entities/User'
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import argon2 from 'argon2'
import { ApolloContext } from '../types'
import { getRepository } from 'typeorm'

@InputType()
class UserRegisterInput {
  @Field({ nullable: true })
  username?: string

  @Field()
  email: string

  @Field()
  password: string

  @Field({ nullable: true })
  bio?: string

  @Field({ nullable: true })
  avatar?: string
}

@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  error?: string

  @Field(() => User, { nullable: true })
  user?: User
}

@ObjectType()
class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}

@ObjectType()
class RegisterResonse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export default class UserResolver {
  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find()
  }

  @Query(() => User, { nullable: true })
  user(
    @Arg('email', () => String, { nullable: true }) email: string,
    @Arg('username', () => String, { nullable: true }) username: string
  ): Promise<User | undefined> {
    if (email) {
      return User.findOne({ email })
    } else {
      return User.findOne({ username })
    }
  }

  @Mutation(() => RegisterResonse)
  async register(
    @Arg('params', () => UserRegisterInput) params: UserRegisterInput
  ): Promise<RegisterResonse> {
    // TODO: 邀請碼注冊
    const user = User.create({
      username: params.username,
      email: params.email,
      password: await argon2.hash(params.password),
      bio: params.bio,
    })

    try {
      await user.save()
    } catch (err) {
      if (err.errno === 1062) {
        return {
          errors: [{ field: 'username', message: 'username already taken' }],
        }
      }
    }

    //TODO: more checker

    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: ApolloContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ email })
    if (!user) return { error: 'login error' }

    const valid = await argon2.verify(user.password, password)
    if (!valid) return { error: 'login error' }

    req.session.userId = user.id
    return { user }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ApolloContext): Promise<Boolean> {
    return await new Promise<Boolean>((_res, _rej) => {
      res.clearCookie('dm')
      req.session.destroy((err) => _res(err ? false : true))
    })
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: ApolloContext): Promise<User | undefined> | null {
    if (!req.session.userId) return null

    // getConnection()
    // .createQueryBuilder()
    // .select('user')
    // .from(User, 'user')
    // .leftJoinAndSelect('user.posts', 'post')
    // .getOne()

    return getRepository(User).findOne({
      where: { id: req.session.userId },
      relations: ['posts'],
    })
  }
}
