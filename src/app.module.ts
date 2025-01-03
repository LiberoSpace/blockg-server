import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsHttpModule } from './module/posts/posts-http.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StartupService } from './startup.service';

@Module({
  imports: [
    PostsHttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '35.222.127.255',
      port: 5432,
      username: 'postgres',
      password: 'Vault1024!',
      database: 'test',
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, StartupService],
})
export class AppModule {}
