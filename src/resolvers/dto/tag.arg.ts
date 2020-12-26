import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateTagArgs {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string
}

@InputType()
export class EditTagArgs extends CreateTagArgs {
  @Field()
  id: string
}

@InputType()
export class DelTagArgs {
  @Field()
  tagId: string

  @Field()
  postId: string
}
