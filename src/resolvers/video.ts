import Video from '../entities/Video'
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { CreateVideoArgs, EditVideoArgs } from './dto/video.arg'
import { getConnection } from 'typeorm'
import Post from '../entities/Post'

@Resolver()
export default class VideoResolver {
  @Query(() => [Video])
  queryVideos(
    @Arg('offset', () => Int, { nullable: true }) offset: number,
    @Arg('limit', () => Int, { nullable: true }) limit: number
  ): Promise<Video[]> {
    if (typeof offset !== 'undefined') {
      return Video.find({
        skip: offset * limit,
        take: limit,
        order: {
          createdAt: 'DESC',
        },
        relations: ['bindPost'],
      })
    } else {
      return Video.find({
        skip: 0,
        take: 15,
        order: { createdAt: 'DESC' },
        relations: ['bindPost'],
      })
    }
  }

  @Mutation(() => Video)
  createVideo(@Arg('options') options: CreateVideoArgs) {
    return Video.create(options).save()
  }

  @Mutation(() => Boolean)
  async editVideo(@Arg('options') { id, ...options }: EditVideoArgs) {
    try {
      await Video.update(id, options)
    } catch (error) {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async delVideo(@Ctx() id: string) {
    try {
      await Video.delete(id)
    } catch (error) {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async addPostVideo(
    @Arg('options') { bindPostId, ...options }: CreateVideoArgs
  ) {
    const video = await Video.create({ ...options }).save()

    try {
      await getConnection()
        .createQueryBuilder()
        .relation(Post, 'videos')
        .of(bindPostId)
        .add(video.id)
    } catch (error) {
      return false
    }

    return true
  }
}
