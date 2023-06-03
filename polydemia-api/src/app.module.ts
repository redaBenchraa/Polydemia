import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './auth/casl/casl.module';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 20,
    }),
    CoursesModule,
    AuthModule,
    UsersModule,
    CaslModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
  ],
})
export class AppModule {}
