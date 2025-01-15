import { BadRequestException } from '@nestjs/common';
import { BlockDto } from '../dtos/blocks-dto';
import { BlockType } from '../enums/block-type.enum';

export class Block {
  type: BlockType;
  subType?: string;
  content?: string;
  placeId?: string;
  mainText?: string;
  subText?: string;
  url?: string;
  currencyCode?: string;
  isThumbnail?: boolean;
  memo?: string;
  expense?: number;
  blocks?: Block[];

  static fromBlockDto(dto: BlockDto): Block {
    const block = new Block();
    block.type = dto.type;
    switch (dto.type) {
      case BlockType.TEXT || BlockType.SECRET:
        if (dto.content === undefined || dto.content === null) {
          throw new BadRequestException('content가 없습니다.');
        }
        block.content = dto.content;
        break;

      case BlockType.HEADER:
        if (dto.content === undefined || dto.content === null) {
          throw new BadRequestException('content가 없습니다.');
        }
        block.content = dto.content;

        if (dto.subType === undefined || dto.subType === null) {
          throw new BadRequestException('헤더 종류가 없습니다.');
        }
        block.subType = dto.subType;
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
    return block;
  }
}
