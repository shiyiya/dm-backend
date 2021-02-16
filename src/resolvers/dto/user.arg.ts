import { InputType, Field, Int } from 'type-graphql'

@InputType()
export class UpdateUserArgs {
  @Field()
  id: string

  @Field()
  email: string

  @Field({ nullable: true })
  username?: string

  @Field({ nullable: true })
  avatar?: string

  @Field({ nullable: true })
  bio?: string
}
