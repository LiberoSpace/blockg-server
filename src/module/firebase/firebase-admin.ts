import { Bucket } from '@google-cloud/storage';
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
  storage() {
    return firebaseAdmin.storage();
  }

  async deleteStorageUserData(uid: string) {
    const folderPath = `users/${uid}/`;
    const storage = this.storage();
    const bucket = storage.bucket('blockg.firebasestorage.app');

    await this.deleteFolderFiles(bucket, folderPath);
  }

  async deleteStoragePostData(uid: string, postNumber: number) {
    const folderPath = `users/${uid}/posts/${postNumber}/images/`;
    const storage = this.storage();
    const bucket = storage.bucket('blockg.firebasestorage.app');

    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to delete is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    // const deleteOptions = {
    //   ifGenerationMatch: generationMatchPrecondition,
    // };

    await this.deleteFolderFiles(bucket, folderPath);
  }

  async deleteFolderFiles(bucket: Bucket, folderPath: string) {
    // 폴더 경로 내부의 모든 파일 나열
    const [files] = await bucket.getFiles({ prefix: folderPath });

    if (files.length === 0) {
      console.log('폴더가 비어있습니다.');
      return;
    }

    // 모든 파일 삭제
    await Promise.all(
      files.map(async (file) => {
        console.log(`Deleting file: ${file.name}`);
        await file.delete();
      }),
    );

    console.log(`폴더 ${folderPath} 내 모든 파일이 삭제되었습니다.`);
  }
}
