import { Field, InputType } from 'type-graphql'
import { CreateVideoArgsWithPost } from './video.arg'

@InputType()
class OptionalPostField {
  @Field()
  title: string

  @Field({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  cover?: string

  @Field({ nullable: true, defaultValue: 0 })
  type?: number

  @Field(() => [String], { nullable: true })
  categoriesId?: string[]

  @Field(() => [String], { nullable: true })
  tagsId?: string[]
}

@InputType()
export class CreatePostArgs extends OptionalPostField {
  @Field()
  creatorId: string

  @Field(() => [CreateVideoArgsWithPost], { nullable: true, defaultValue: [] })
  videos?: CreateVideoArgsWithPost[]
}

@InputType()
export class UpdatePostArgs extends OptionalPostField {
  @Field()
  id: string
}

@InputType()
export class QueryPostsArgs {
  @Field(() => String, { nullable: true })
  id?: string

  @Field({ nullable: true, defaultValue: '' })
  title?: string

  @Field({ nullable: true, defaultValue: -1 })
  type?: number

  @Field({ nullable: true })
  creatorId?: string

  @Field(() => [String], { nullable: true })
  categoriesId?: string[]

  @Field(() => [String], { nullable: true })
  tagsId?: string[]

  @Field({ defaultValue: 0 })
  offset?: number

  @Field({ defaultValue: 15 })
  limit?: number
}
