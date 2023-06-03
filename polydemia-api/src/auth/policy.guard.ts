import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AppAbility,
  CaslAbilityFactory,
} from 'src/auth/casl/casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from './policy.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
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
