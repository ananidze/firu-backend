import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TagsModule } from './tags/tags.module';
import { DirectorsModule } from './directors/directors.module';
import { StudiosModule } from './studios/studios.module';
import { CategoriesModule } from './categories/categories.module';
import config from './common/configs/config';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    MoviesModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    TagsModule,
    DirectorsModule,
    StudiosModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
