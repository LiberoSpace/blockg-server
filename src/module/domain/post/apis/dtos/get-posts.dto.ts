import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageDto } from '../../../../../utils/page.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsDto extends PageDto {
  @ApiPropertyOptional({
    description: '큐레이션 목록 조회 시 목록 번호',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  curationNumber?: number;

  @ApiPropertyOptional({
    description: '검색어',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: '장소 필터. 국내이면 true',
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  isDomestic?: boolean;
}
