import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { UpdatePostEvent } from '../enums/update-post-event.enum';

export class UpdatePostDto {
  @ApiProperty({
    description: '글 정보 업데이트를 진행할 이벤트',
    enum: UpdatePostEvent,
  })
  @IsEnum(UpdatePostEvent)
  event: UpdatePostEvent;
}
