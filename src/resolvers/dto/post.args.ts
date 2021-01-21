import { Field, InputType, Int } from 'type-graphql'
import { CreateVideoArgsWithPost } from './video.arg'

@InputType()
class OptionalPostField {
  @Field()
  title: string

  @Field({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  cover?: string

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  type?: number

  @Field(() => [String], { nullable: true })
  categoriesId?: string[]

  @Field(() => [String], { nullable: true })
  tagsId?: string[]

  @Field(() => String, { nullable: true })
  content?: string
}

@InputType()
export class CreatePostArgs extends OptionalPostField {
  @Field(() => [CreateVideoArgsWithPost], { nullable: true, defaultValue: [] })
  videos?: CreateVideoArgsWithPost[]
}

@InputType()
export class UpdatePostArgs {
  @Field()
  title: string

  @Field({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  cover?: string

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  type?: number

  @Field()
  id: string
}

@InputType()
export class QueryPostsArgs {
  @Field(() => String, { nullable: true })
  id?: string

  @Field({ nullable: true, defaultValue: '' })
  title?: string

  @Field(() => Int, { nullable: true, defaultValue: -1 })
  type?: number

  @Field({ nullable: true })
  creatorId?: string

  @Field(() => [String], { nullable: true })
  categoriesId?: string[]

  @Field(() => [String], { nullable: true })
  tagsId?: string[]

  @Field(() => Int, { defaultValue: 0 })
  offset?: number

  @Field(() => Int, { defaultValue: 15 })
  limit?: number
}
