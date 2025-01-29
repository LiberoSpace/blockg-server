import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '프로필 이미지 url',
  })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiPropertyOptional({
    description: '닉네임',
  })
  @IsString()
  @IsOptional()
  nickName?: string;
}
