import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { Post } from './module/domain/posts/entities/post.entity';
import { PostsHttpModule } from './module/domain/posts/posts-http.module';
import { User } from './module/domain/users/entities/user.entity';
import { UsersHttpModule } from './module/domain/users/users-http.module';
import { FirebaseAdminModule } from './module/firebase/firebase-admin.module';
import { StartupService } from './startup.service';
import { AuthModule } from './module/domain/users/auth.module';

@Module({
  imports: [
    FirebaseAdminModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: 'postgres',
      password: env.DB_PASSWORD,
      database: 'blockg',
      entities: [User, Post],
      synchronize: false,
    }),
    UsersHttpModule,
    PostsHttpModule,
  ],
  controllers: [AppController],
  providers: [StartupService],
})
export class AppModule {}
