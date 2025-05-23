import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { Post } from '../post/entities/post.entity';
import { FirebaseAdminModule } from '../../firebase/firebase-admin.module';

@Module({
  imports: [FirebaseAdminModule, TypeOrmModule.forFeature([User, Post])],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
