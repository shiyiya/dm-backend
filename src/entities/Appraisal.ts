import { Field, Int, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne } from 'typeorm'
import Post from './Post'
import User from './User'
import _BaseEntity from './_BaseEntity'

@ObjectType()
@Entity()
export default class Appraisal extends _BaseEntity {
  @Field()
  @Column()
  content: string

  @Field(() => Int)
  @Column()
  rate: number

  @Field()
  @Column()
  bindPostId: String

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.appraisals, {
    // onDelete: 'CASCADE',
  })
  bindPost: Post

  @Field()
  @Column()
  creatorId: String

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.appraisals)
  creator: User
}
