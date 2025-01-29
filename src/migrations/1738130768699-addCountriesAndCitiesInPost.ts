import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountriesAndCitiesInPost1738130768699
  implements MigrationInterface
{
  name = 'AddCountriesAndCitiesInPost1738130768699';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" ADD "countries" text array`);
    await queryRunner.query(`ALTER TABLE "post" ADD "cities" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "cities"`);
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "countries"`);
  }
}
