import { Module } from '@nestjs/common';
import { AuthService } from '../user/services/auth.service';
import { FirebaseAdminModule } from '../../firebase/firebase-admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserStatistics } from './entities/user-statistics.entity';

@Module({
  imports: [
    FirebaseAdminModule,
    TypeOrmModule.forFeature([User, UserStatistics]),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
