import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class PageDto {
  @ApiProperty({ example: 10, description: '반환할 아이템 개수, 최대 1000' })
  @Transform((o) => {
    return Number(o.value);
  })
  @IsInt()
  @Min(0)
  @Max(1000)
  limit: number;

  @ApiProperty({ example: 0, description: '반환할 아이템의 시작 페이지 번호' })
  @Transform((o) => {
    return Number(o.value);
  })
  @IsInt()
  @Min(0)
  page: number;
}
