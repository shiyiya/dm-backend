import { Field, ObjectType } from 'type-graphql'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import Post from './Post'
import _BaseEntity from './_BaseEntity'

@ObjectType()
@Entity()
export default class Tag extends _BaseEntity {
  @Field()
  @Column()
  name: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string

  @Field(() => [Post], { nullable: true })
  @ManyToMany(() => Post, (p) => p.tags, { nullable: true })
  posts?: Post[]
}
