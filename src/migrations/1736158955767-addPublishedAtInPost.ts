import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublishedAtInPost1736158955767 implements MigrationInterface {
    name = 'AddPublishedAtInPost1736158955767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "publishedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "publishedAt"`);
    }

}
