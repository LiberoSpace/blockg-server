import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThumbnailTextInPost1737473863417 implements MigrationInterface {
  name = 'AddThumbnailTextInPost1737473863417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD "thumbnailText" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "thumbnailText"`);
  }
}
