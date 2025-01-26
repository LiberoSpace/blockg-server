import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsString, ValidateNested } from 'class-validator';
import { PostStatus } from '../../enums/post-status.enum';
import { BlockDto } from './blocks-dto';
import { PostTagType } from '../../enums/post-tag-type.enum';

export class UpdatePostDto {
  @ApiProperty({
    description: '제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '발행 여부',
    enum: PostStatus,
  })
  @IsEnum(PostStatus)
  status: PostStatus;

  // @ApiPropertyOptional({
  //   description: '글에 작성된 여행의 총 비용, 기준은 대한민국 원화',
  // })
  // @IsNumber()
  // @IsOptional()
  // totalExpense: number;

  @ApiProperty({
    description: '블록 배열',
    type: () => BlockDto,
    isArray: true,
  })
  @Type(() => BlockDto)
  @ValidateNested()
  @IsArray()
  blocks: BlockDto[];

  @ApiPropertyOptional({
    description: '태그 종류 배열',
    enum: PostTagType,
    isArray: true,
  })
  @IsEnum(PostTagType, { each: true })
  @IsArray()
  postTagTypes: PostTagType[];
}
