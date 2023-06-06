import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from '../auth/casl/casl-ability.factory';
import { IsPublicRoute } from './auth.utils';
import { CHECK_POLICIES_KEY, PolicyHandler } from './policy.decorator';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = await IsPublicRoute(this.reflector, context);
    if (isPublic) {
      return true;
    }
    const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
        CHECK_POLICIES_KEY,
        context.getHandler(),
      ) || [];
    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);
    return policyHandlers.every((handler) =>
      this.executePolicyHander(handler, ability),
    );
  }

  private executePolicyHander(handler: PolicyHandler, ability: AppAbility) {
    return typeof handler === 'function'
      ? handler(ability)
      : handler.handle(ability);
  }
}
