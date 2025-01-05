import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // dto에 데코레이터(@)로 명시된 속성 외에 다른 속성은 받아들이지 않는 필터기능
      whitelist: true,
      // 요청에서 넘어온 자료들의 형변환
      transform: true,
      // whitelist 설정을 켜서 걸러질 속성이 있다면 아예 요청 자체를 막도록 (400 에러)
      // forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Blockg')
    .setContact('ChanYoung Park', '', 'parklim2254@gmail.com')
    .setDescription('The Blockg API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
