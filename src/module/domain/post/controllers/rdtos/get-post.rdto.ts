import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Block } from '../../entities/block.entity';
import { Post } from '../../entities/post.entity';
import { BlockType } from '../../enums/block-type.enum';
import { PostStatus } from '../../enums/post-status.enum';
import { PostTagType } from '../../enums/post-tag-type.enum';
import { BlockDto } from '../dtos/block.dto';
import { BlockRdto } from './block.rdto';

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
    description: '유저 글 번호',
  })
  @IsNumber()
  postNumber: number;

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

  @ApiProperty({
    description: '글 태그 타입 배열',
    enum: PostTagType,
    isArray: true,
  })
  @IsEnum(PostTagType, { each: true })
  @IsArray()
  postTagTypes: PostTagType[];

  static fromEntity({
    post,
    isMine = false,
  }: {
    post: Post;
    isMine?: boolean;
  }) {
    const rdto = new GetPostRdto();
    rdto.id = post.id;
    rdto.postNumber = post.postNumber;
    rdto.title = post.title;
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
    rdto.blocks = plainToInstance(BlockRdto, post.content);
    // const blockRdtos = plainToInstance(BlockRdto, post.content);
    // rdto.blocks = blockRdtos.map((blockRdto, index) => {
    //   if (blockRdto.type !== BlockType.PLACE) {
    //     return blockRdto;
    //   }
    //   const mapData = post.content[index].googleMapsData;
    //   if (!mapData) return blockRdto;

    //   blockRdto.country = mapData.address_components.find((component) =>
    //     component.types.find((type) => type === 'country'),
    //   );
    //   blockRdto.city = mapData.address_components.find((component) =>
    //     component.types.find((type) => type === 'administrative_area_level_1'),
    //   );
    //   blockRdto.placeThumbnails = mapData.photos.slice(0, 2);
    //   return blockRdto;
    // });

    if (post.postTags) {
      rdto.postTagTypes = post.postTags.map((postTag) => postTag.tagType);
    }

    return rdto;
  }
}
