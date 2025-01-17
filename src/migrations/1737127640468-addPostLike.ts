import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostLike1737127640468 implements MigrationInterface {
    name = 'AddPostLike1737127640468'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_like" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer NOT NULL, "postId" integer NOT NULL, CONSTRAINT "UQ_754a5e1d4e513c739e9c39a8d79" UNIQUE ("userId", "postId"), CONSTRAINT "PK_0e95caa8a8b56d7797569cf5dc6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "referenceId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "referenceId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "post_like" ADD CONSTRAINT "FK_909fc474ef645901d01f0cc0662" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_like" ADD CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_like" DROP CONSTRAINT "FK_789b3f929eb3d8760419f87c8a9"`);
        await queryRunner.query(`ALTER TABLE "post_like" DROP CONSTRAINT "FK_909fc474ef645901d01f0cc0662"`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "referenceId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "referenceId" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`DROP TABLE "post_like"`);
    }

}
