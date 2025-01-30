import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { User } from '../../entities/user.entity';
import { UserStatistics } from '../../entities/user-statistics.entity';
import { plainToInstance, Type } from 'class-transformer';
import { PostTagTypeCount } from '../../../post/classes/post-tag-type-count';
import { PostCountryCount } from '../../../post/classes/post-country-count';
import { PostStatus } from 'src/module/domain/post/enums/post-status.enum';

export class GetUserRdto {
  @ApiProperty({
    description: '프로필 이미지 경로',
  })
  @IsString()
  profileImageUrl: string;

  @ApiProperty({
    description: '닉네임',
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    description: '핸들',
  })
  @IsString()
  handle: string;

  @ApiProperty({
    description: '가입일',
  })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({
    description: '유저 관련 통계',
    type: UserStatistics,
  })
  @Type(() => UserStatistics)
  @IsOptional()
  statistics?: UserStatistics;

  @ApiPropertyOptional({
    description: '글 태그 타입 통계',
    type: PostTagTypeCount,
    isArray: true,
  })
  @Type(() => PostTagTypeCount)
  @IsArray()
  @IsOptional()
  postTagTypeCounts?: PostTagTypeCount[];

  @ApiPropertyOptional({
    description: '글 국가 통계',
    type: PostCountryCount,
    isArray: true,
  })
  @Type(() => PostCountryCount)
  @IsArray()
  @IsOptional()
  postCountryCounts?: PostCountryCount[];

  @ApiPropertyOptional({
    description: '최근 글 발행일. 없을 경우 반환 x',
  })
  @IsDate()
  @IsOptional()
  recentPublishedAt?: Date;

  static fromUser(
    user: User,
    statistics: UserStatistics,
    postTagTypeCounts: PostTagTypeCount[],
    postCountryCounts: PostCountryCount[],
  ): GetUserRdto {
    const rdto = new GetUserRdto();
    rdto.profileImageUrl = user.profileImageUrl;
    rdto.nickName = user.nickName;
    rdto.handle = user.handle;
    rdto.createdAt = user.createdAt;
    rdto.statistics = plainToInstance(UserStatistics, statistics);
    rdto.postTagTypeCounts = postTagTypeCounts;
    rdto.postCountryCounts = postCountryCounts;
    return rdto;
  }

  static fromUserToSearchEngine(user: User): GetUserRdto {
    const rdto = new GetUserRdto();
    rdto.profileImageUrl = user.profileImageUrl;
    rdto.nickName = user.nickName;
    rdto.handle = user.handle;
    rdto.createdAt = user.createdAt;

    const publishedPosts = user.posts.filter(
      (post) => post.status === PostStatus.PUBLISHED,
    );
    const sortedPosts = publishedPosts.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    );
    if (sortedPosts.length > 0)
      rdto.recentPublishedAt = sortedPosts[0].publishedAt;
    return rdto;
  }
}
