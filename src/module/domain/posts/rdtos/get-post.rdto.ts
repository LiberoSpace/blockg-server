import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BlockDto } from '../dtos/blocks-dto';
import { Post } from '../entities/post.entity';
import { PostStatus } from '../enums/post-status.enum';

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

  @ApiProperty({
    description: '글 상태',
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

  static fromEntity(post: Post) {
    const rdto = new GetPostRdto();
    rdto.id = post.id;
    rdto.title = post.title;

    rdto.profileImageUrl = post.user.profileImageUrl;
    rdto.nickName = post.user.nickName;

    rdto.publishedAt = post.publishedAt;
    rdto.blockCount = post.blockCount;
    rdto.totalExpense = post.totalExpense;
    rdto.views = post.views;

    rdto.blocks = post.content;
    return rdto;
  }
}
