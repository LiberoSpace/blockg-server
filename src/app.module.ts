import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { ExchangeRate } from './module/domain/exchange-rate/entities/exchange-rate.entity';
import { ExchangeRateHttpModule } from './module/domain/exchange-rate/exchange-rate-http.module';
import { PostComment } from './module/domain/post/entities/post-comment.entity';
import { PostLike } from './module/domain/post/entities/post-like.entity';
import { PostTag } from './module/domain/post/entities/post-tag.entity';
import { Post } from './module/domain/post/entities/post.entity';
import { PostHttpModule } from './module/domain/post/post-http.module';
import { AuthHttpModule } from './module/domain/user/auth-http.module';
import { UserStatistics } from './module/domain/user/entities/user-statistics.entity';
import { User } from './module/domain/user/entities/user.entity';
import { UserHttpModule } from './module/domain/user/user-http.module';
import { StartupService } from './startup.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
