import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { getConnection } from 'typeorm'
import Tag from '../entities/Tag'
import { CreateTagArgs, DelTagArgs, EditTagArgs } from './dto/tag.arg'
import Post from '../entities/Post'

@Resolver()
export default class TagResolver {
  @Mutation(() => Tag)
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
