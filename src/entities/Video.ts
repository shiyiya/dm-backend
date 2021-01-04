import { Field, Int, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne } from 'typeorm'
import Post from './Post'
import _BaseEntity from './_BaseEntity'

@ObjectType()
@Entity()
export default class Video extends _BaseEntity {
  @Field()
  @Column()
  title: string

  @Field()
  @Column()
  playUrl: string

  @Field(() => Int)
  @Column()
  episode: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  cover?: string

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.videos)
  bindPost: Post
}
