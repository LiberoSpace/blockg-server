import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtInExchangeRate1736857336619
  implements MigrationInterface
{
  name = 'AddCreatedAtInExchangeRate1736857336619';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rate" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exchange_rate" DROP COLUMN "createdAt"`,
    );
  }
}
