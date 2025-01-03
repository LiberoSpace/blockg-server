import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '글의 내용' })
  @IsString()
  content: string;
}
