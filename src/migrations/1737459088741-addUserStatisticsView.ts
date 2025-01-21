import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserStatisticsView1737459088741 implements MigrationInterface {
  name = 'AddUserStatisticsView1737459088741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE VIEW "user_statistics" AS SELECT "user"."id" AS "userId", SUM("post"."views") AS "postViews", SUM("post"."blockCount") AS "blockCount" FROM "user" "user" LEFT JOIN "post" "post" ON "user"."id" = "post"."userId" GROUP BY "user"."id"`,
    );
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
      [
        'public',
        'VIEW',
        'user_statistics',
        'SELECT "user"."id" AS "userId", SUM("post"."views") AS "postViews", SUM("post"."blockCount") AS "blockCount" FROM "user" "user" LEFT JOIN "post" "post" ON "user"."id" = "post"."userId" GROUP BY "user"."id"',
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
      ['VIEW', 'user_statistics', 'public'],
    );
    await queryRunner.query(`DROP VIEW "user_statistics"`);
  }
}
