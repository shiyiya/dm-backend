import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { getConnection } from 'typeorm'
import Category from '../entities/Category'
import {
  CreateCategoryArgs,
  DelCategoryArgs,
  EditCategoryArgs,
} from './dto/category.arg'
import Post from '../entities/Post'

@Resolver()
export default class CategoryResolver {
  @Mutation(() => Category)
  createCategory(@Arg('options') options: CreateCategoryArgs) {
    return Category.create(options).save()
  }

  @Mutation(() => Boolean)
  async editCategory(@Arg('options') { id, ...options }: EditCategoryArgs) {
    try {
      await Category.update(id, options)
    } catch (error) {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async addPostCategory(@Arg('options') options: DelCategoryArgs) {
    try {
      await getConnection()
        .createQueryBuilder()
        .relation(Post, 'categories')
        .of(options.postId)
        .add(options.categoryId)
    } catch (error) {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async delPostCategory(@Ctx() options: DelCategoryArgs) {
    await getConnection()
      .createQueryBuilder()
      .relation(Post, 'categories')
      .of(options.postId)
      .remove(options.categoryId)

    return true
  }
}
