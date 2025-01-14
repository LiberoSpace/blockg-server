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
import { ExchangeRateHttpModule } from './module/domain/exchange-rate/exchange-rate-http.module';
import { ConfigModule } from '@nestjs/config';
import { ExchangeRate } from './module/domain/exchange-rate/exchange-rate.entity';
import { AuthHttpModule } from './module/domain/users/auth-http.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FirebaseAdminModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: 'postgres',
      password: env.DB_PASSWORD,
      database: 'blockg',
      entities: [User, Post, ExchangeRate],
      synchronize: false,
    }),
    UsersHttpModule,
    PostsHttpModule,
    ExchangeRateHttpModule,
    AuthHttpModule,
  ],
  controllers: [AppController],
  providers: [StartupService],
})
export class AppModule {}
