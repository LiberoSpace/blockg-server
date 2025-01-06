import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UpdatePostEvent } from './enums/update-post-event.enum';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // async findAll(): Promise<Post[]> {
  //   return await this.postsRepository.find();
  // }

  // async findOne(id: number): Promise<Post | null> {
  //   return await this.postsRepository.findOneBy({ id });
  // }

  async createPost(userId: number): Promise<Number> {
    const insertResult = await this.postsRepository.insert({
      userId,
    });
    return Number(insertResult.identifiers[0].id);
  }

  async overwritePost() {}

  publishPost() {}

  async updatePost(postId: number, dto: UpdatePostDto) {
    switch (dto.event) {
      case UpdatePostEvent.VIEW:
        await this.postsRepository.increment({ id: postId }, 'views', 1);
        break;
      case UpdatePostEvent.SHARE:
        await this.postsRepository.increment({ id: postId }, 'shareCount', 1);
        break;
      default:
    }
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
