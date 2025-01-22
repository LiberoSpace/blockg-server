import { ApiPropertyOptional } from '@nestjs/swagger';
import { PageDto } from '../../../../../utils/page.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsDto extends PageDto {
  @ApiPropertyOptional({
    description: '큐레이션 목록 조회 시 목록 번호',
  })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsNumber()
  curationNumber?: number;
}
