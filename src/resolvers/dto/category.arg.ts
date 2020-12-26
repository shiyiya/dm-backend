import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateCategoryArgs {
  @Field()
  name: string

  @Field({ nullable: true })
  description?: string
}

@InputType()
export class EditCategoryArgs extends CreateCategoryArgs {
  @Field()
  id: string
}

@InputType()
export class DelCategoryArgs {
  @Field()
  categoryId: string

  @Field()
  postId: string
}
