import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurationNumber1737536170290 implements MigrationInterface {
  name = 'AddCurationNumber1737536170290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "curationNumber" smallint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "curationNumber"`);
  }
}
