import { Module } from '@nestjs/common';
import { FirebaseAdmin } from './firebase-admin';

@Module({
  providers: [FirebaseAdmin],
  exports: [FirebaseAdmin],
})
export class FirebaseAdminModule {}
