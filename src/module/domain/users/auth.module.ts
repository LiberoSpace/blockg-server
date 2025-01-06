import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAdminModule } from '../../firebase/firebase-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [FirebaseAdminModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
