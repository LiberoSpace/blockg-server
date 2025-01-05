import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { FirebaseAdmin } from './firebase.service';
import { PostsHttpModule } from './module/posts/posts-http.module';
import { StartupService } from './startup.service';

@Module({
  imports: [
    PostsHttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: 'postgres',
      password: env.DB_PASSWORD,
      database: 'blockg',
    }),
  ],
  controllers: [AppController],
  providers: [StartupService, FirebaseAdmin],
})
export class AppModule { }
