import { BadRequestException } from '@nestjs/common';
import { BlockDto } from '../dtos/blocks-dto';
import { BlockType } from '../enums/block-type.enum';

export class Block {
  type: BlockType;
  content?: string;
  placeId?: string;
  mainText?: string;
  subText?: string;
  url?: string;
  currencyCode?: string;
  isThumbnail?: boolean;
  memo?: string;
  expense?: number;

  static fromBlockDto(dto: BlockDto): Block {
    const block = new Block();
    block.type = dto.type;
    switch (dto.type) {
      case BlockType.TEXT ||
        BlockType.HEADER_1 ||
        BlockType.HEADER_2 ||
        BlockType.HEADER_1 ||
        BlockType.SECRET:
        if (dto.content === undefined || dto.content === null) {
          throw new BadRequestException('content가 없습니다.');
        }
        block.content = dto.content;
        break;
      case BlockType.IMAGE:
        if (!dto.url) {
          throw new BadRequestException('url이 없습니다.');
        }
        block.url = dto.url;
        if (dto.isThumbnail) {
          block.isThumbnail = true;
        }
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
        if (!dto.url) {
          throw new BadRequestException('url이 없습니다.');
        }
        block.mainText = dto.mainText;
        block.subText = dto.subText;
        block.placeId = dto.placeId;
        block.url = dto.url;
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
        break;
      case BlockType.DATE:
        break;
    }
    return block;
  }
}
