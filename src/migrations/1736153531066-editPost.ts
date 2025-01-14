import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditPost1736153531066 implements MigrationInterface {
  name = 'EditPost1736153531066';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "published"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "temporary"`);
    await queryRunner.query(
      `CREATE TYPE "public"."post_status_enum" AS ENUM('temporary', 'drift', 'published')`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "status" "public"."post_status_enum" NOT NULL DEFAULT 'temporary'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "temporary" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "published" boolean NOT NULL DEFAULT false`,
    );
  }
}
