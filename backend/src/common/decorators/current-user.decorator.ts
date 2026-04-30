import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract current user ID from JWT token in request
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id || request.user?.sub;
  },
);
