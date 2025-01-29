import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PostCountryCount {
  @ApiProperty({
    description: '국가 코드',
  })
  country: string;

  @ApiProperty({
    description: '국가 개수',
  })
  @IsNumber()
  count: number;
}
