import { AbilityBuilder, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Category, Course, Lesson, Review, User } from '@prisma/client';

export type Action = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type SubjectList = Subjects<{
  User: User;
  Category: Category;
  Course: Course;
  Review: Review;
  Lesson: Lesson;
}>;

export type AppAbility = PureAbility<
  [Action, SubjectList | 'all'],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);
    switch (user.role) {
      case 'ADMIN':
        can('manage', 'all');
        break;
      case 'USER':
        can('manage', 'User', { id: user.id });
        break;
      case 'CREATOR':
        can('manage', 'User', { id: user.id });
        can('manage', 'Course', {
          creatorUserId: user.id,
        });
        break;
    }
    return build();
  }
}
