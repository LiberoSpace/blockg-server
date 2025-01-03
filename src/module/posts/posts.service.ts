import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.postsRepository.findOneBy({ id });
  }

  async save({ content }: { content: string }): Promise<Post> {
    return await this.postsRepository.save({ content });
  }

  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }
}
