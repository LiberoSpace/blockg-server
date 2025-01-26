import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './controllers/dtos/create-user.dto';
import { User } from './entities/user.entity';
import { uniqueHandleGenerator } from './unique-handle-generator';
import { NickNameGenerator } from './nick-name-generator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUser({
    userId,
    uid,
    handle,
  }: {
    userId?: number;
    uid?: string;
    handle?: string;
  }): Promise<User> {
    try {
      if (userId) {
        const user = await this.userRepository.findOne({
          where: { id: userId },
        });
        if (!user) {
          throw new NotFoundException('id에 해당하는 유저가 없습니다.');
        }
        return user;
      }
      if (uid) {
        const user = await this.userRepository.findOne({ where: { uid: uid } });
        if (!user) {
          throw new NotFoundException('uid에 해당하는 유저가 없습니다.');
        }
        return user;
      }
      if (handle) {
        const user = await this.userRepository.findOne({
          where: { handle: handle },
        });
        if (!user) {
          throw new NotFoundException('handle에 해당하는 유저가 없습니다.');
        }
        return user;
      }
      throw new BadRequestException('식별자를 제공해주세요');
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createUser(uid: string, dto: CreateUserDto): Promise<number> {
    let existUser = await this.userRepository.findOneBy({
      uid: uid,
    });
    if (existUser) {
      throw new ConflictException('uid에 해당하는 유저가 이미 존재합니다.');
    }

    let handle: string;
    do {
      handle = uniqueHandleGenerator();
      existUser = await this.userRepository.findOneBy({ handle: handle });
    } while (existUser);

    const insertResult = await this.userRepository.insert(
      this.userRepository.create({
        uid: uid,
        profileImageUrl: dto.profileImageUrl,
        email: dto.email,
        nickName: dto.nickName ?? NickNameGenerator(),
        handle: handle,
      }),
    );
    return Number(insertResult.identifiers[0].id);
  }
}
