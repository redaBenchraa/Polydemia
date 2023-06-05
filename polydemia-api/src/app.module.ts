import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './auth/casl/casl.module';
import { CoursesModule } from './courses/courses.module';
import { LoggingInterceptor } from './logger.interceptor';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 20,
    }),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      password: 'redis',
      port: 6379,
      isGlobal: true,
    }),
    PrometheusModule.register(),
    CoursesModule,
    AuthModule,
    UsersModule,
    CaslModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
