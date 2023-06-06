import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

export const IsPublicRoute = async (
  reflector: Reflector,
  context: ExecutionContext,
): Promise<boolean> => {
  const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  const isMetrics = context.getClass().name === 'PrometheusController';
  return isPublic || isMetrics;
};
