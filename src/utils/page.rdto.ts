import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PageRdto {
  @ApiProperty({
    description: 'item 총 개수',
  })
  totalCount: number;

  @ApiProperty({
    description: '페이지 총 개수',
  })
  pageCount: number;

  @ApiPropertyOptional({
    description: '다음 페이지 번호',
  })
  next?: number;

  @ApiPropertyOptional({
    description: '이전 페이지 번호',
  })
  prev?: number;
}
