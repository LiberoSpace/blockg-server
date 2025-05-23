import { BadRequestException } from '@nestjs/common';
import { BlockDto } from '../controllers/dtos/block.dto';
import { BlockType } from '../enums/block-type.enum';
import { GoogleMapsData } from '../classes/google-maps-data';
import { Exclude } from 'class-transformer';

export class Block {
  type: BlockType;
  subType?: string;
  content?: string;
  placeId?: string;
  mainText?: string;
  subText?: string;
  url?: string;
  link?: string;
  currencyCode?: string;
  isThumbnail?: boolean;
  memo?: string;
  expense?: number;

  @Exclude()
  googleMapsData: GoogleMapsData;

  blocks?: Block[];

  static fromBlockDto(dto: BlockDto): Block {
    const block = new Block();
    block.type = dto.type;
    switch (dto.type) {
      case BlockType.TEXT:
        assignContent();
        assignThumbnail();
        break;

      case BlockType.HEADLINE:
        assignContent();
        assignSubType();
        assignThumbnail();
        break;

      case BlockType.SECRET:
        assignContent();
        break;

      case BlockType.IMAGE:
        assignUrl();
        assignThumbnail();

        break;

      case BlockType.PLACE:
        if (!dto.placeId) {
          throw new BadRequestException('placeId이 없습니다.');
        }
        if (!dto.mainText) {
          throw new BadRequestException('mainText이 없습니다.');
        }
        if (!dto.subText) {
          throw new BadRequestException('subText이 없습니다.');
        }
        if (!dto.link) {
          throw new BadRequestException('link가 없습니다.');
        }
        if (!dto.googleMapsData) {
          throw new BadRequestException('googleMapsData이 없습니다.');
        }
        block.mainText = dto.mainText;
        block.subText = dto.subText;
        block.placeId = dto.placeId;
        block.link = dto.link;
        block.googleMapsData = dto.googleMapsData;
        break;

      case BlockType.EXPENSE:
        if (!dto.expense) {
          throw new BadRequestException('expense가 없습니다.');
        }
        if (!dto.currencyCode) {
          throw new BadRequestException('currencyCode이 없습니다.');
        }
        block.expense = dto.expense;
        block.currencyCode = dto.currencyCode;
        block.memo = dto.memo;
        break;

      case BlockType.SCHEDULE:
        if (!dto.blocks || dto.blocks.length === 0) {
          throw new BadRequestException(
            '일정 블록에 하위 블록이 하나도 없습니다.',
          );
        }
        if (!dto.blocks.every((block) => block.type === BlockType.DATE)) {
          throw new BadRequestException(
            '일정 블록의 모든 하위 블록은 날짜 블록이어야 합니다.',
          );
        }
        block.blocks = dto.blocks.map((block) => Block.fromBlockDto(block));
        break;

      case BlockType.DATE:
        if (!dto.blocks || dto.blocks.length === 0) {
          throw new BadRequestException(
            '날짜 블록에 하위 블록이 하나도 없습니다.',
          );
        }
        if (
          !dto.blocks.every(
            (block) =>
              block.type === BlockType.PLACE || block.type === BlockType.TEXT,
          )
        ) {
          throw new BadRequestException(
            '날짜 블록의 모든 하위 블록은 장소 블록이거나 텍스트 블록이어야 합니다.',
          );
        }
        block.blocks = dto.blocks.map((block) => Block.fromBlockDto(block));
        break;
    }
    function assignSubType() {
      if (dto.subType === undefined || dto.subType === null) {
        throw new BadRequestException('subType가 없습니다.');
      }
      block.subType = dto.subType;
    }
    function assignThumbnail() {
      if (dto.isThumbnail) {
        block.isThumbnail = true;
      }
    }
    function assignContent() {
      if (dto.content === undefined || dto.content === null) {
        throw new BadRequestException('content가 없습니다.');
      }
      block.content = dto.content;
    }
    function assignUrl() {
      if (!dto.url) {
        throw new BadRequestException('url이 없습니다.');
      }
      block.url = dto.url;
    }

    return block;
  }
}
