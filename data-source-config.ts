import { env } from 'process';
import { DataSource } from 'typeorm';

const dataSourceConfig = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: 'postgres',
  password: env.DB_PASSWORD,
  database: 'blockg',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
})
export default dataSourceConfig;
