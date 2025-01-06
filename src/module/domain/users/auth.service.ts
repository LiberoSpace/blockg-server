import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { FirebaseAdmin } from '../../firebase/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

@Injectable()
export class AuthService {
  constructor(
    private firebaseAdmin: FirebaseAdmin,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserOrNull(uid: string): Promise<User | null> {
    return await this.userRepository.findOneBy({
      uid,
    });
  }

  async verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken> {
    return await this.firebaseAdmin.auth().verifyIdToken(idToken);
  }
}
