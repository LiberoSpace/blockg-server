import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostTags1737870022221 implements MigrationInterface {
  name = 'AddPostTags1737870022221';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."post_tag_tagtype_enum" AS ENUM('planned', 'impromptu', 'backpacking', 'peddler', 'alone', 'friend', 'child', 'parent', 'couple', 'family', 'organization', 'onFoot', 'publicTransportation', 'rentalCar', 'ownCar', 'touristAttraction', 'restaurant', 'bakery', 'local')`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_tag" ("id" SERIAL NOT NULL, "tagType" "public"."post_tag_tagtype_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "postId" integer, CONSTRAINT "PK_3364a9669ea4b632cff0eb01944" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_tag" ADD CONSTRAINT "FK_444c1b4f6cd7b632277f5579354" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_tag" DROP CONSTRAINT "FK_444c1b4f6cd7b632277f5579354"`,
    );
    await queryRunner.query(`DROP TABLE "post_tag"`);
    await queryRunner.query(`DROP TYPE "public"."post_tag_tagtype_enum"`);
  }
}
