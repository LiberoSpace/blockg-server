import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferenceIdInPost1736863739323 implements MigrationInterface {
  name = 'AddReferenceIdInPost1736863739323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "referenceId" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `CREATE INDEX "reference_id_index" ON "post" ("referenceId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."reference_id_index"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "referenceId"`);
  }
}
