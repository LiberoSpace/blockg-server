import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class GetMeRdto {
  @ApiProperty({
    description: '프로필 이미지 경로',
  })
  @IsString()
  profileImageUrl: string;

  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  email: string;

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

  static fromUser(user: User): GetMeRdto {
    const me = new GetMeRdto();
    me.profileImageUrl = user.profileImageUrl;
    me.email = user.email;
    me.nickName = user.nickName;
    me.handle = user.handle;
    me.createdAt = user.createdAt;
    return me;
  }
}
