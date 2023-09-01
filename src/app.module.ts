import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './common/configs/config';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    // UsersModule,
    // RolesModule,
    MoviesModule,
    ConfigModule.forRoot({ isGlobal: true, load: [config] },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
