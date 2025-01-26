import { PageRdto } from '../../../../../utils/page.rdto';
import { Post } from '../../entities/post.entity';
import { Page } from '../../../../../utils/page';
import { ApiProperty } from '@nestjs/swagger';
import { GetPostRdto } from './get-post.rdto';

export class GetPostsRdto extends PageRdto {
  @ApiProperty({
    description: '아이템들',
    type: GetPostRdto,
    isArray: true,
  })
  posts: GetPostRdto[];

  static fromPage(page: Page<Post>): GetPostsRdto {
    const { items, ...pageData } = page;
    return {
      ...pageData,
      posts: items.map((post) => GetPostRdto.fromEntity({ post })),
    };
  }
}
