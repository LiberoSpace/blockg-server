import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsString } from 'class-validator';
import { User } from '../../entities/user.entity';
import { UserStatistics } from '../../entities/user-statistics.entity';
import { plainToInstance, Type } from 'class-transformer';
import { PostTagTypeCount } from '../../../post/classes/post-tag-type-count';
import { PostCountryCount } from 'src/module/domain/post/classes/post-country-count';

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

  @ApiProperty({
    description: '유저 관련 통계',
    type: UserStatistics,
  })
  @Type(() => UserStatistics)
  statistics: UserStatistics;

  @ApiProperty({
    description: '글 태그 타입 통계',
    type: PostTagTypeCount,
    isArray: true,
  })
  @Type(() => PostTagTypeCount)
  @IsArray()
  postTagTypeCounts: PostTagTypeCount[];

  @ApiProperty({
    description: '글 국가 통계',
    type: PostCountryCount,
    isArray: true,
  })
  @Type(() => PostCountryCount)
  @IsArray()
  postCountryCounts: PostCountryCount[];

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
}
