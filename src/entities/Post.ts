import { Field, ObjectType } from 'type-graphql'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import Appraisal from './Appraisal'
import Category from './Category'
import Tag from './Tag'
import User from './User'
import Video from './Video'
import _BaseEntity from './_BaseEntity'

@ObjectType()
@Entity()
export default class Post extends _BaseEntity {
  @Field()
  @Column()
  title: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  subtitle?: string

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  content?: string

  @Field()
  @Column({ nullable: true })
  cover?: string

  @Field()
  @Column({ default: 0 })
  type: number // video 0 or topic 1

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  creator: User

  @Field(() => [Video], { nullable: true })
  @OneToMany(() => Video, (video) => video.bindPost)
  videos?: Video[]

  @Field(() => [Appraisal], { nullable: true })
  @OneToMany(() => Appraisal, (appraisals) => appraisals.bindPost)
  appraisals?: Appraisal[]

  @Field(() => [Category], { nullable: true })
  @ManyToMany(() => Category, { nullable: true })
  @JoinTable({ name: 'posts_cas' })
  categories?: Category[]

  @Field(() => [Tag], { nullable: true })
  @ManyToMany(() => Tag, { nullable: true })
  @JoinTable({ name: 'posts_tags' })
  tags?: Tag[]
}
