import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '@prisma/client';

export type CurrentUserType = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'avatarUrl'
>;

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserType => {
    const request = ctx.switchToHttp().getRequest<{ user: CurrentUserType }>();
    return request.user;
  },
);
