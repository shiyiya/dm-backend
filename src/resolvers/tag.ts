import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { getConnection, UpdateResult } from 'typeorm'
import Tag from '../entities/Tag'
import { CreateTagArgs, DelTagArgs, EditTagArgs } from './dto/tag.arg'
import Post from '../entities/Post'

@Resolver()
export default class TagResolver {
  @Query(() => [Tag])
  queryTags(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number
  ) {
    if (typeof offset !== 'undefined') {
      return Tag.find({
        skip: offset * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
      })
    } else {
      return Tag.find({ skip: 0, take: 15, order: { createdAt: 'DESC' } })
    }
  }

  @Query(() => Tag)
  createTag(@Arg('options') options: CreateTagArgs) {
    return Tag.create(options).save()
  }

  @Mutation(() => Boolean)
  async editTag(@Arg('options') { id, ...options }: EditTagArgs) {
    try {
      await Tag.update(id, options)
    } catch (error) {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async addPostTag(@Arg('options') options: DelTagArgs) {
    try {
      await getConnection()
        .createQueryBuilder()
        .relation(Post, 'tags')
        .of(options.postId)
        .add(options.tagId)
    } catch (error) {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async delPostTag(@Ctx() options: DelTagArgs) {
    await getConnection()
      .createQueryBuilder()
      .relation(Post, 'tags')
      .of(options.postId)
      .remove(options.tagId)

    return true
  }
}
