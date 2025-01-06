import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAndPost1736147348245 implements MigrationInterface {
    name = 'AddUserAndPost1736147348245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying, "thumbnailUrl" character varying, "blockCount" integer NOT NULL DEFAULT '0', "shareCount" integer NOT NULL DEFAULT '0', "views" integer NOT NULL DEFAULT '0', "totalExpense" integer, "published" boolean NOT NULL DEFAULT false, "temporary" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "content" json, "userId" integer NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "uid" character varying NOT NULL, "profileImageUrl" character varying, "email" character varying NOT NULL, "nickName" character varying NOT NULL, "handle" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "user_uid_uc" UNIQUE ("uid"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
