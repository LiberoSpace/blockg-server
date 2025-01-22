import { ApiProperty } from '@nestjs/swagger';

export class GetPostCommentRdto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: '댓글 내용',
  })
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({
    description: '유저 닉네임',
  })
  nickName: string;

  @ApiProperty({
    description: '유저 핸들',
  })
  handle: string;

  @ApiProperty({
    description: '프로필 이미지',
    nullable: true,
  })
  profileImageUrl: string;
}
