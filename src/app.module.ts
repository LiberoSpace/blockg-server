import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { Post } from './module/domain/post/entities/post.entity';
import { PostHttpModule } from './module/domain/post/post-http.module';
import { User } from './module/domain/user/entities/user.entity';
import { UserHttpModule } from './module/domain/user/user-http.module';
import { FirebaseAdminModule } from './module/firebase/firebase-admin.module';
import { StartupService } from './startup.service';
import { AuthModule } from './module/domain/user/auth.module';
import { ExchangeRateHttpModule } from './module/domain/exchange-rate/exchange-rate-http.module';
import { ConfigModule } from '@nestjs/config';
import { ExchangeRate } from './module/domain/exchange-rate/entities/exchange-rate.entity';
import { AuthHttpModule } from './module/domain/user/auth-http.module';
import { PostLike } from './module/domain/post/entities/post-like.entity';
import { UserStatistics } from './module/domain/user/entities/user-statistics.entity';
import { PostComment } from './module/domain/post/entities/post-comment.entity';
import { PostTag } from './module/domain/post/entities/post-tag.entity';

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
      entities: [
        User,
        Post,
        ExchangeRate,
        PostLike,
        UserStatistics,
        PostComment,
        PostTag,
      ],
      synchronize: false,
    }),
    UserHttpModule,
    PostHttpModule,
    ExchangeRateHttpModule,
    AuthHttpModule,
  ],
  controllers: [AppController],
  providers: [StartupService],
})
export class AppModule {}
