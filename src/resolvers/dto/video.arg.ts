import { Field, InputType } from 'type-graphql'

@InputType()
export class OptionalVideoField {
  @Field()
  title: string

  @Field()
  playUrl: string

  @Field()
  episode: number

  @Field({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  cover?: string
}

@InputType()
export class CreateVideoArgsWithPost extends OptionalVideoField {
  @Field({ nullable: true }) //  創建 post 后傳遞
  bindPostId?: string
}

@InputType()
export class CreateVideoArgs extends OptionalVideoField {
  @Field({ nullable: true })
  bindPostId: string
}

@InputType()
export class EditVideoArgs extends OptionalVideoField {
  @Field()
  id: string
}
