import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from '../enums/block-type.enum';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

export class BlockDto {
  @ApiProperty({
    description: '타입',
    enum: BlockType,
  })
  @IsEnum(BlockType)
  type: BlockType;
}

export class OverwritePostDto {
  @ApiProperty({
    description: '제목',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: '발행 여부',
  })
  @IsBoolean()
  published: boolean;

  @ApiProperty({
    description: '글에 작성된 여행의 총 비용, 기준은 대한민국 원화',
  })
  @IsNumber()
  totalExpense: number;
}
