import { DataSource } from 'typeorm';

const dataSourceConfig: any = new DataSource({
  type: 'postgres',
  host: '35.222.127.255',
  port: 5432,
  username: 'postgres',
  password: 'Vault1024!',
  database: 'test',
  entities: ['src/module/**/entity/*.ts'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
});
export default dataSourceConfig;
