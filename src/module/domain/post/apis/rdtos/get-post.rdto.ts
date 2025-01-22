import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BlockDto } from '../dtos/blocks-dto';
import { Post } from '../../entities/post.entity';
import { PostStatus } from '../../enums/post-status.enum';
import { Block } from '../../entities/block.entity';
import { plainToInstance } from 'class-transformer';
import { BlockType } from '../../enums/block-type.enum';

export class GetPostRdto {
  @ApiProperty({})
  @IsInt()
  id: number;

  @ApiProperty({
    description: '제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '식별자',
  })
  @IsString()
  referenceId: string;

  @ApiProperty({
    description: '이미지 썸네일 Url',
  })
  @IsString()
  thumbnailUrl: string | null;

  @ApiProperty({
    description: '썸네일 텍스트',
  })
  @IsString()
  thumbnailText: string | null;

  @ApiProperty({
    description: '프로필 이미지가 저장된 경로',
    nullable: true,
  })
  @IsString()
  profileImageUrl: string | null;

  @ApiProperty({
    description: '닉네임',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    description: '핸들',
  })
  handle: string;

  @ApiProperty({
    description: '출판일',
  })
  @IsDate()
  publishedAt: Date;

  @ApiProperty({
    description: '블록 수',
  })
  @IsInt()
  blockCount: number;

  @ApiProperty({
    description: '총 비용',
  })
  @IsInt()
  totalExpense: number | null;

  @ApiProperty({
    description: '조회 수',
  })
  @IsInt()
  views: number;

  @ApiPropertyOptional({
    description: '좋아요 수. 목록 조회 시 보이지 않음.',
  })
  @IsInt()
  likeCount?: number;

  @ApiProperty({
    description: '공유 수',
  })
  @IsInt()
  shareCount: number;

  @ApiProperty({
    description: '댓글 수',
  })
  @IsInt()
  commentCount: number;

  @ApiProperty({
    description: '글 상태',
    enum: PostStatus,
  })
  @IsEnum(PostStatus)
  status: PostStatus;

  @ApiProperty({
    description: '작성 시작 시각',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: '블록 배열',
    type: () => BlockDto,
    isArray: true,
  })
  @ValidateNested()
  @IsArray()
  blocks: BlockDto[];

  static fromEntity({
    post,
    isMine = false,
  }: {
    post: Post;
    isMine?: boolean;
  }) {
    const rdto = new GetPostRdto();
    rdto.id = post.id;
    rdto.title = post.title;
    rdto.referenceId = post.referenceId;
    rdto.thumbnailUrl = post.thumbnailUrl;
    rdto.thumbnailText = post.thumbnailText;

    rdto.profileImageUrl = post.user.profileImageUrl;
    rdto.nickName = post.user.nickName;
    rdto.handle = post.user.handle;

    rdto.publishedAt = post.publishedAt;
    rdto.blockCount = post.blockCount;
    rdto.totalExpense = post.totalExpense;
    rdto.views = post.views;
    rdto.likeCount = post.likeCount;
    rdto.shareCount = post.shareCount;
    rdto.commentCount = post.commentCount;

    if (!isMine && post.content.length > 0) {
      post.content = post.content.filter(
        (block) => block.type !== BlockType.SECRET,
      );
    }
    rdto.blocks = plainToInstance(Block, post.content);
    return rdto;
  }
}
