import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BlockType } from '../../enums/block-type.enum';
import { Type } from 'class-transformer';

export class BlockDto {
  @ApiProperty({
    description: '블록의 타입',
    enum: BlockType,
  })
  @IsEnum(BlockType)
  type: BlockType;

  @ApiPropertyOptional({
    description: '블록의 보조 타입. 원하는 값으로 사용',
  })
  @IsString()
  @IsOptional()
  subType?: string;

  @ApiPropertyOptional({
    description: '내용. 사용: [text, headline, secret]',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: '구글 맵 장소 ID. 사용: [place]',
  })
  @IsString()
  @IsOptional()
  placeId?: string;

  @ApiPropertyOptional({
    description: '메인 텍스트. 사용: [place]',
  })
  @IsString()
  @IsOptional()
  mainText?: string;

  @ApiPropertyOptional({
    description: '서브 텍스트. 사용: [place]',
  })
  @IsString()
  @IsOptional()
  subText?: string;

  @ApiPropertyOptional({
    description: 'url. 사용: [image, place]',
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: '화폐코드. 사용: [expense]',
  })
  @IsString()
  @IsOptional()
  currencyCode?: string;

  @ApiPropertyOptional({
    description: '대표이미지 여부. 사용: [image]',
  })
  @IsBoolean()
  @IsOptional()
  isThumbnail?: boolean;

  @ApiPropertyOptional({
    description: '비용에 대한 메모. 사용: [expense]',
  })
  @IsString()
  @IsOptional()
  memo?: string;

  @ApiPropertyOptional({
    description: '비용. 사용: [expense]',
  })
  @IsNumber()
  @IsOptional()
  expense?: number;

  @ApiPropertyOptional({
    description: '하위 블록. 현재는 날짜만 지원',
    type: BlockDto,
    isArray: true,
  })
  @Type(() => BlockDto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  blocks?: BlockDto[];
}
