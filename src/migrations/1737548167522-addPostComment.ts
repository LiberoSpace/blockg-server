import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostComment1737548167522 implements MigrationInterface {
  name = 'AddPostComment1737548167522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "PK_5a0d63e41c3c55e11319613550c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" ADD CONSTRAINT "FK_5675870bd3124aeeaa476256062" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" ADD CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_comment" DROP CONSTRAINT "FK_c7fb3b0d1192f17f7649062f672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_comment" DROP CONSTRAINT "FK_5675870bd3124aeeaa476256062"`,
    );
    await queryRunner.query(`DROP TABLE "post_comment"`);
  }
}
