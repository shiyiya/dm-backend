import Video from '../entities/Video'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { CreateVideoArgs, EditVideoArgs } from './dto/video.arg'
import { getConnection } from 'typeorm'
import Post from '../entities/Post'

@Resolver()
export default class VideoResolver {
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
