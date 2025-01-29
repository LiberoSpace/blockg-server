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
  lat: number;

  @ApiProperty()
  @IsNumber()
  lng: number;
}

export class GoogleMapsViewport {
  @ApiProperty({
    type: () => GoogleMapsLatLng,
  })
  @Type(() => GoogleMapsLatLng)
  @ValidateNested()
  northeast: GoogleMapsLatLng;

  @ApiProperty({
    type: () => GoogleMapsLatLng,
  })
  @Type(() => GoogleMapsLatLng)
  @ValidateNested()
  southwest: GoogleMapsLatLng;
}

export class GoogleMapsGeometry {
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
}

export class GoogleMapsPlusCode {
  @ApiProperty()
  @IsString()
  compound_code: string;

  @ApiProperty()
  @IsString()
  global_code: string;
}

export class GoogleMapsRawReference {
  @ApiProperty()
  @IsString()
  fife_url: string;
}

export class GoogleMapsPhoto {
  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiPropertyOptional({ description: '기여자 문자열', isArray: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  html_attributions?: string[];

  @ApiProperty()
  @IsString()
  photo_reference: string;

  @ApiProperty({
    type: () => GoogleMapsRawReference,
  })
  @Type(() => GoogleMapsRawReference)
  @ValidateNested()
  raw_reference: GoogleMapsRawReference;
}

export class GoogleMapsAddressComponent {
  @ApiProperty()
  @IsString()
  long_name: string;

  @ApiProperty()
  @IsString()
  short_name: string;

  @ApiProperty({ description: '주소 타입', isArray: true })
  @IsArray()
  @IsString({ each: true })
  types: string[];
}

export class GoogleMapsData {
  @ApiProperty({
    type: () => GoogleMapsAddressComponent,
    isArray: true,
  })
  @Type(() => GoogleMapsAddressComponent)
  @ValidateNested({ each: true })
  address_components: GoogleMapsAddressComponent[];

  @ApiProperty()
  @IsString()
  formatted_address: string;

  @ApiProperty({ description: '장소 타입', isArray: true })
  @IsArray()
  @IsString({ each: true })
  types: string[];

  @ApiProperty({
    type: () => GoogleMapsPlusCode,
  })
  @Type(() => GoogleMapsPlusCode)
  @ValidateNested()
  plus_code: GoogleMapsPlusCode;

  @ApiProperty({
    type: () => GoogleMapsGeometry,
  })
  @Type(() => GoogleMapsGeometry)
  @ValidateNested()
  geometry: GoogleMapsGeometry;

  @ApiProperty({
    type: () => GoogleMapsPhoto,
    isArray: true,
  })
  @Type(() => GoogleMapsPhoto)
  @ValidateNested({ each: true })
  photos: GoogleMapsPhoto[];
}
