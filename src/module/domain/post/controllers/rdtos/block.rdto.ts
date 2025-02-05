import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  GoogleMapsAddressComponent,
  GoogleMapsData,
  GoogleMapsPhoto,
} from '../../classes/google-maps-data';
import { BlockType } from '../../enums/block-type.enum';

export class BlockRdto {
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
    description: 'url. 사용: [image]',
  })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiPropertyOptional({
    description: '외부로 연결되는 링크. 사용: [place]',
  })
  @IsString()
  @IsOptional()
  link?: string;

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
    description: '구글 맵 데이터 원본',
    type: GoogleMapsData,
  })
  @IsOptional()
  googleMapsData?: GoogleMapsData;

  // @ApiPropertyOptional({
  //   description: '장소 썸네일',
  //   type: GoogleMapsPhoto,
  //   isArray: true,
  // })
  // @IsOptional()
  // placeThumbnails?: GoogleMapsPhoto[];

  // @ApiPropertyOptional({
  //   description: '구글 맵스 데이터, 나라 주소 컴포넌트',
  //   type: GoogleMapsAddressComponent,
  // })
  // @IsOptional()
  // @Type(() => GoogleMapsAddressComponent)
  // @ValidateNested()
  // country?: GoogleMapsAddressComponent;

  // @ApiPropertyOptional({
  //   description: '구글 맵스 데이터, 도시 주소 컴포넌트',
  //   type: GoogleMapsAddressComponent,
  // })
  // @IsOptional()
  // @Type(() => GoogleMapsAddressComponent)
  // @ValidateNested()
  // city?: GoogleMapsAddressComponent;

  @ApiPropertyOptional({
    description: '하위 블록. 현재는 날짜만 지원',
    type: BlockRdto,
    isArray: true,
  })
  @Type(() => BlockRdto)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  blocks?: BlockRdto[];
}
