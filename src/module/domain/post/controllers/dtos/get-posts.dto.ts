import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageDto } from '../../../../../utils/page.dto';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
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
    description:
      '나라 필터. 자신의 [국가 코드] -> 국내, ![국가 코드] -> 해외. EX) !KR -> 한국 제외. KR -> 한국만',
  })
  @IsString()
  @IsOptional()
  domesticCountryCode?: string;

  @ApiPropertyOptional({
    description: '최소 비용 필터',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  minExpense: number;

  @ApiPropertyOptional({
    description: '최대 비용 필터',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  maxExpense: number;
}
