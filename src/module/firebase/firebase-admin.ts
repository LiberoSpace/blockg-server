import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseAdmin {
  constructor() {
    firebaseAdmin.initializeApp();
  }
  auth() {
    return firebaseAdmin.auth();
  }
}
