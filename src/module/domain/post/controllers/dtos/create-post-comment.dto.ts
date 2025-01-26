import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostCommentDto {
  @ApiProperty({
    description: '텍스트',
  })
  @IsString()
  content: string;
}
