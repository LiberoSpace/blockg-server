import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

// page 번호가 0부터 시작하고 totalCount를 반환하는 Page 객체
export class Page<T> {
  @ApiProperty({
    description: '아이템 총 개수',
  })
  totalCount: number;

  @ApiProperty({
    description: '페이지 총 개수',
  })
  pageCount: number;

  @ApiProperty({
    description: '아이템 리스트',
  })
  items: T[];

  @ApiPropertyOptional({
    description: '다음 페이지 번호',
  })
  next?: number;

  @ApiPropertyOptional({
    description: '이전 페이지 번호',
  })
  prev?: number;

  constructor(totalCount: number, items: T[], limit: number, page: number) {
    if (!(limit > 0 && page >= 0)) {
      this.items = items;
      this.totalCount = totalCount;
      this.pageCount = 1;
      return;
    }
    this.items = items;
    this.totalCount = totalCount;
    this.pageCount = Math.ceil(totalCount / limit);
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;

    if (endIndex < totalCount) {
      this.next = page + 1;
    }
    if (startIndex > 0) {
      if (page === 0) {
        this.prev = undefined;
      } else {
        this.prev = page - 1;
      }
    }
  }
}
