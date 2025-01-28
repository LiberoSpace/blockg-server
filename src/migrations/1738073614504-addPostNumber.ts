import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostNumber1738073614504 implements MigrationInterface {
  name = 'AddPostNumber1738073614504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."reference_id_index"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "referenceId"`);
    await queryRunner.query(`ALTER TABLE "post" ADD "postNumber" integer`);
    // 기존 데이터에 대해 userId별 createdAt 순으로 postNumber 할당
    await queryRunner.query(`
    DO $$
    DECLARE
      user_row RECORD;
    BEGIN
      FOR user_row IN
        SELECT DISTINCT "userId"
        FROM "post"
      LOOP
        UPDATE "post"
        SET "postNumber" = subquery.new_post_number
        FROM (
          SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt") AS new_post_number
          FROM "post"
          WHERE "userId" = user_row."userId"
        ) AS subquery
        WHERE "post"."id" = subquery."id";
      END LOOP;
    END $$;
  `);
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "postNumber" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "user_id_post_number_uk" UNIQUE ("userId", "postNumber")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "user_id_post_number_uk"`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "postNumber"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "referenceId" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `CREATE INDEX "reference_id_index" ON "post" ("referenceId") `,
    );
  }
}
