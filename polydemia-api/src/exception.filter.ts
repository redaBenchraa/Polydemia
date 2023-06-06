import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Request, Response } from 'express';
import { Counter } from 'prom-client';
import { v4 as uuidv4 } from 'uuid';

export enum ErrorDomain {
  users = 'Users',
  categories = 'Categories',
  courses = 'Courses',
  reviews = 'Reviews',
  subscriptions = 'Subscriptions',
  generic = 'Generic',
}

export class BusinessException extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: ErrorDomain,
    public readonly message: string,
    public readonly apiMessage: string,
    public readonly status: HttpStatus,
  ) {
    super(message);
    this.id = uuidv4();
    this.timestamp = new Date();
  }
}

export interface ApiError {
  id: string;
  domain: ErrorDomain;
  message: string;
  timestamp: Date;
}

@Catch(Error)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);
  constructor(
    @InjectMetric('polymdemia_api_errors')
    private readonly counter: Counter<string>,
  ) {}
  catch(exception: Error, host: ArgumentsHost) {
    let body: ApiError;
    let status: HttpStatus;

    if (exception instanceof BusinessException) {
      body = {
        id: exception.id,
        message: exception.apiMessage,
        domain: exception.domain,
        timestamp: exception.timestamp,
      };
      status = exception.status;
    } else if (exception instanceof HttpException) {
      body = new BusinessException(
        ErrorDomain.generic,
        exception.message,
        exception.message,
        exception.getStatus(),
      );
      status = exception.getStatus();
    } else {
      body = new BusinessException(
        ErrorDomain.generic,
        `Internal error occurred: ${exception.message}`,
        'Internal error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    this.counter.labels(body.domain, status.toString()).inc();

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    this.logger.error(
      `Got an exception: ${JSON.stringify({
        path: request.url,
        ...body,
      })}`,
    );

    response.status(status).json(body);
  }
}
