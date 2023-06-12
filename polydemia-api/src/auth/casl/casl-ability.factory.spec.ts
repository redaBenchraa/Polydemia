import { Role, User } from '@prisma/client';
import { CaslAbilityFactory } from './casl-ability.factory';

describe('CaslAbilityFactory', () => {
  const user: User = {
    id: 0,
    email: 'admin@email.com',
    password: 'changeme',
    role: Role.ADMIN,
    firstName: 'Admin',
    lastName: 'Admin',
    banned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  it('should be defined', () => {
    expect(new CaslAbilityFactory()).toBeDefined();
  });

  it('should create ability for admin', () => {
    const ability = new CaslAbilityFactory().createForUser(user);
    expect(ability.can('manage', 'all')).toBeTruthy();
  });

  it('should create ability for user', () => {
    const simpleUser: User = { ...user, role: Role.USER };
    const ability = new CaslAbilityFactory().createForUser(simpleUser);
    expect(ability.can('manage', 'all')).toBeFalsy();
    expect(ability.can('manage', 'Course')).toBeFalsy();
    expect(ability.can('manage', 'User')).toBeTruthy();
  });

  it('should create ability for creator', () => {
    const simpleUser: User = { ...user, role: Role.CREATOR };
    const ability = new CaslAbilityFactory().createForUser(simpleUser);
    expect(ability.can('manage', 'all')).toBeFalsy();
    expect(ability.can('manage', 'User')).toBeTruthy();
    expect(ability.can('manage', 'Course')).toBeTruthy();
  });
});
