import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class GoogleMapsLatLng {
  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;
}

export class GoogleMapsViewport {
  @ApiProperty({
    type: () => GoogleMapsLatLng,
  })
  @Type(() => GoogleMapsLatLng)
  @ValidateNested()
  high: GoogleMapsLatLng;

  @ApiProperty({
    type: () => GoogleMapsLatLng,
  })
  @Type(() => GoogleMapsLatLng)
  @ValidateNested()
  low: GoogleMapsLatLng;
}

export class GoogleMapsPlusCode {
  @ApiProperty()
  @IsString()
  compoundCode: string;

  @ApiProperty()
  @IsString()
  globalCode: string;
}

export class AuthorAttributions {
  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  uri: string;

  @ApiProperty()
  @IsString()
  photoUri: string;
}

export class GoogleMapsPhoto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  heightPx?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  widthPx?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  flagContentUri?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  googleMapsUri?: string;

  @ApiPropertyOptional({
    type: () => AuthorAttributions,
  })
  @Type(() => AuthorAttributions)
  @ValidateNested()
  @IsOptional()
  authorAttributions?: AuthorAttributions;
}

export class GoogleMapsAddressComponent {
  @ApiProperty()
  @IsString()
  longText: string;

  @ApiProperty()
  @IsString()
  shortText: string;

  @ApiProperty({ description: '주소 타입', isArray: true })
  @IsArray()
  @IsString({ each: true })
  types: string[];

  @ApiProperty({ description: '언어 타입' })
  @IsString()
  languageCode: string;
}

export class GoogleMapsData {
  @ApiProperty({
    type: () => GoogleMapsAddressComponent,
    isArray: true,
  })
  @Type(() => GoogleMapsAddressComponent)
  @ValidateNested({ each: true })
  addressComponents: GoogleMapsAddressComponent[];

  @ApiProperty()
  @IsString()
  formattedAddress: string;

  @ApiProperty({ description: '장소 타입', isArray: true })
  @IsArray()
  @IsString({ each: true })
  types: string[];

  @ApiProperty({ description: '장소 타입' })
  @IsString()
  primaryType: string;

  @ApiProperty({
    type: () => GoogleMapsPlusCode,
  })
  @Type(() => GoogleMapsPlusCode)
  @ValidateNested()
  plusCode: GoogleMapsPlusCode;

  @ApiProperty({
    type: () => GoogleMapsLatLng,
  })
  @Type(() => GoogleMapsLatLng)
  @ValidateNested()
  location: GoogleMapsLatLng;

  @ApiProperty({
    type: () => GoogleMapsViewport,
  })
  @Type(() => GoogleMapsViewport)
  @ValidateNested()
  viewport: GoogleMapsViewport;

  // @ApiProperty({
  //   type: () => GoogleMapsPhoto,
  //   isArray: true,
  // })
  // @Type(() => GoogleMapsPhoto)
  // @ValidateNested({ each: true })
  // photos: GoogleMapsPhoto[];
}
