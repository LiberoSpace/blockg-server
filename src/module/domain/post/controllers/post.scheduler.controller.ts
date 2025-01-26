import { Controller, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController } from '@nestjs/swagger';
import { CloudSchedulerGuard } from '../../../../guards/cloud-scheduler.guard';
import { PostService } from '../services/post.service';

@ApiBearerAuth('JWT')
@UseGuards(CloudSchedulerGuard)
@ApiExcludeController()
@Controller('blockg/scheduler-api/v1/posts')
export class PostSchedulerController {
  constructor(private readonly postService: PostService) {}

  // 임시 상태만 삭제, 추후에 바디로 추가해야 함.
  @Delete('/')
  async deleteTemporaryPosts() {
    await this.postService.deleteTemporaryPosts();
  }
}
