import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }
    return next.handle();
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent = request.get('user-agent') || '';
    const { ip, method, path: url } = request;
    const correlationKey = uuidv4();
    const requestParts = [method, url, userAgent, ip];
    const header = request.header('Authorization');
    if (typeof header === 'string') {
      requestParts.push(this.extractToken(header));
    }

    requestParts.push(correlationKey);

    this.logger.log(requestParts.join(' '));

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.get('content-length');

        const responseParts = [
          method,
          url,
          statusCode,
          contentLength,
          `${Date.now() - now}ms`,
          correlationKey,
        ];

        this.logger.log(responseParts.join(' '));
      }),
    );
  }

  private extractToken(input: string) {
    const chunks = String(input).trim().split(' ');

    return chunks?.length === 2 && chunks[0].toLowerCase() === 'bearer'
      ? chunks[1].split('.')[1]
      : null;
  }
}
