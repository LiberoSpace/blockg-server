import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExchangeRate1736846795236 implements MigrationInterface {
  name = 'AddExchangeRate1736846795236';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exchange_rate" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "conversionRate" jsonb NOT NULL, CONSTRAINT "PK_5c5d27d2b900ef6cdeef0398472" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "exchange_rate"`);
  }
}
