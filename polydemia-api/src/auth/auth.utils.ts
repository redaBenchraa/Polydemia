import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

export const IsPublicRoute = async (
  reflector: Reflector,
  context: ExecutionContext,
): Promise<boolean> => {
  const request = context.switchToHttp().getRequest();
  const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  const isMetrics = request.url.includes('metrics');
  return isPublic || isMetrics;
};
