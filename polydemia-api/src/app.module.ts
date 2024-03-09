import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  PrometheusModule,
  makeCounterProvider,
} from '@willsoto/nestjs-prometheus';
import * as redisStore from 'cache-manager-redis-store';
import { env } from 'process';
import { appConstants } from './app.constants';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './auth/casl/casl.module';
import { CoursesModule } from './courses/courses.module';
import { CustomExceptionFilter } from './exception.filter';
import { LoggingInterceptor } from './logger.interceptor';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 20,
    }),
    CacheModule.register({
      store: redisStore,
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      isGlobal: true,
    }),
    PrometheusModule.register(),
    CoursesModule,
    AuthModule,
    UsersModule,
    CaslModule,
    CategoriesModule,
  ],
  providers: [
    makeCounterProvider({
      name: appConstants.counter_api_error_label,
      help: 'Number of API errors',
      labelNames: ['domain', 'status'],
    }),
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
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
