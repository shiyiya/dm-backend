import { Field, Int, ObjectType } from 'type-graphql'
import { Column, Entity, OneToMany } from 'typeorm'
import Appraisal from './Appraisal'
import Post from './Post'
import _BaseEntity from './_BaseEntity'

@ObjectType()
@Entity()
export default class User extends _BaseEntity {
  @Field(() => Int)
  @Column({ default: 1, type: 'tinyint' }) //0 admin  1 gust 2 writer ...
  roleLevel: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  resetPWDToken?: string

  @Field({ nullable: true })
  @Column({ length: 8, unique: true, nullable: true })
  username?: string

  @Field()
  @Column({ unique: true })
  email: string

  @Field()
  @Column()
  password: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar?: string

  @Field({ nullable: true })
  @Column({ nullable: true, length: 15 })
  bio?: string

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.creator)
  posts?: Post[]

  @Field(() => [Appraisal], { nullable: true })
  @OneToMany(() => Appraisal, (appraisal) => appraisal.creator)
  appraisals?: Appraisal[]
}
