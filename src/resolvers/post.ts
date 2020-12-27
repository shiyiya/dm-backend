import Post from '../entities/Post'
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql'
import { CreatePostArgs, QueryPostsArgs, UpdatePostArgs } from './dto/post.args'
import Category from '../entities/Category'
import Tag from '../entities/Tag'
import User from '../entities/User'
import { FindConditions, getRepository } from 'typeorm'
import Video from '../entities/Video'

@Resolver()
export default class PostResolver {
  @Mutation(() => [Post])
  async posts(
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
      skip: offset,
      take: limit,
      // where:`title like %${title}%`,
      where,
      relations: ['creator', 'tags', 'appraisals', 'categories', 'videos'],
      order: { createdAt: 'DESC' },
    })
  }

  @Query(() => [Post], { nullable: true })
  postsByTitle(@Arg('title') title: String) {
    return getRepository(Post)
      .createQueryBuilder('p')
      .where('p.title like :title', {
        title: `%${title}%`,
      })
      .andWhere('p.status = :status', { status: 0 })
      .leftJoinAndSelect('p.videos', 'video')
      .getMany()
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id', () => Int) id: number): Promise<Post | undefined> {
    return Post.findOne(id)
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('options')
    { categoriesId, tagsId, creatorId, videos, ...options }: CreatePostArgs
  ): Promise<Post> {
    let categories, tags
    if (categoriesId) categories = await Category.findByIds(categoriesId)
    if (tagsId) tags = await Tag.findByIds(tagsId)

    console.log('===============')
    console.log(categories, tags, videos)
    console.log('==============')

    const post = await Post.create({
      creator: await User.findOne(creatorId),
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

  @Mutation(() => Boolean)
  async updatePost(
    @Arg('options')
    {
      id,
      title,
      subtitle,
      categoriesId,
      tagsId,
      type,
      cover,
      ...options
    }: UpdatePostArgs
  ): Promise<Boolean> {
    const post = await Post.findOne(id)

    if (!post) return false

    Post.update(id, { title, type, subtitle, cover })

    return true
  }

  @Mutation(() => Boolean)
  async delectPost(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Post.delete(id)
    return true
  }
}
