import { ApiProperty } from '@nestjs/swagger';
import { PostTagType } from '../../enums/post-tag-type.enum';
import { IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostTagTypeCountRdto {
  @ApiProperty({
    description: '글 태그 타입',
    enum: PostTagType,
  })
  @IsEnum(PostTagType)
  postTagType: PostTagType;

  @ApiProperty({
    description: '글 태그 타입의 개수',
  })
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  count: number;
}
