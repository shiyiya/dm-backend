import { Field, ObjectType } from 'type-graphql'
import { Column, Entity } from 'typeorm'
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

  // @ManyToMany(() => Post, { nullable: true })
  // @JoinTable()
  // posts: Post[]
}
