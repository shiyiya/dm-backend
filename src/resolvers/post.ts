import Post from '../entities/Post'
import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from 'type-graphql'
import { CreatePostArgs, QueryPostsArgs, UpdatePostArgs } from './dto/post.args'
import Category from '../entities/Category'
import Tag from '../entities/Tag'
import User from '../entities/User'
import { FindConditions, getRepository } from 'typeorm'
import Video from '../entities/Video'
import type { Request, Response } from 'express'

export type ApolloContext = {
  req: Request
  res: Response
}
@Resolver()
export default class PostResolver {
  @Query(() => [Post], { nullable: true })
  queryLastedPosts() {
    return Post.find({ order: { updatedAt: 'DESC' }, skip: 0, take: 20 })
  }

  @Query(() => [Post], { nullable: true })
  queryRecommendPost() {
    return Tag.find({ where: { id: '1' }, relations: ['posts'] })
  }

  @Query(() => Post, { nullable: true })
  queryPostById(@Arg('id') id: string) {
    return Post.findOne(id, {
      relations: ['creator', 'tags', 'appraisals', 'categories', 'videos'],
    })
  }

  @Query(() => [Post], { nullable: true })
  queryPostsByTitle(@Arg('title') title: String) {
    return (
      getRepository(Post)
        .createQueryBuilder('p')
        .where('p.title like :title', { title: `%${title}%` })
        .andWhere('p.status = :status', { status: 0 })
        .offset(0)
        .limit(30)
        // .leftJoinAndSelect('p.videos', 'video')
        .getMany()
    )
  }

  @Query(() => Category, { nullable: true })
  queryPostsByCa(@Arg('caId') caId: String) {
    return Category.findOne({ where: { id: caId }, relations: ['posts'] })
  }

  @Query(() => Tag, { nullable: true })
  queryPostsByTag(@Arg('tagId') tagId: String) {
    return Tag.findOne({ where: { id: tagId }, relations: ['posts'] })
  }

  @Mutation(() => [Post])
  async queryPosts(
    @Arg('options')
    { id, categoriesId, creatorId, tagsId, offset, limit, type }: QueryPostsArgs
  ): Promise<Post[]> {
    const where: FindConditions<Post> = {
      status: 0,
    }

    if (type != -1) where.type = type
    if (tagsId) where.tags = await Tag.findByIds(tagsId)
    if (creatorId) where.creator = await User.findOne(creatorId)
    if (categoriesId) where.categories = await Category.findByIds(categoriesId)
    // if (title) where.title = title
    if (id) where.id = id

    return Post.find({
      // @ts-ignore
      skip: offset * limit,
      take: limit,
      where,
      relations: ['creator', 'tags', 'appraisals', 'categories', 'videos'],
      order: { createdAt: 'DESC' },
    })
  }

  @Mutation(() => Post)
  async createPost(
    @Ctx() { req }: ApolloContext,
    @Arg('options')
    { categoriesId, tagsId, videos, ...options }: CreatePostArgs
  ): Promise<Post> {
    let categories, tags
    if (categoriesId) categories = await Category.findByIds(categoriesId)
    if (tagsId) tags = await Tag.findByIds(tagsId)

    const post = await Post.create({
      creator: await User.findOne(req.session.userId),
      tags,
      categories,
      ...options,
    }).save()

    if (videos?.length) {
      post.videos = []
      for (let index = 0; index < videos.length; index++) {
        const video = videos[index]

        post.videos?.push(
          await Video.create({ bindPost: post, ...video }).save()
        )
      }
    }

    return post
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('options')
    { id, title, subtitle, type, cover }: UpdatePostArgs
  ): Promise<Post> {
    const post = await Post.findOne(id)

    if (!post) return null as any

    Post.update(id, { title, type, subtitle, cover })

    return post
  }

  @Mutation(() => Boolean)
  async delPostById(@Arg('id', () => ID) id: number): Promise<boolean> {
    try {
      await Post.delete(id)
      return true
    } catch {
      return false
    }
  }
}
