import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    description: '프로필 이미지 url',
  })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiProperty({
    description: '이메일',
  })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    description: '닉네임',
  })
  @IsString()
  @IsOptional()
  nickName?: string;

  @ApiPropertyOptional({
    description: '핸들. @제외',
  })
  @IsString()
  @IsOptional()
  handle?: string;
}
