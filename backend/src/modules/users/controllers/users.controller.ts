import { Get, Controller, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserResponseDto } from '../dto/auth.dto';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class UsersController {
  constructor(private authService: AuthService) {}

  /**
   * Get public user profile
   * Returns limited public information about a user
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get user public profile',
    description:
      'Get public profile information of a user by ID. Shows name, city, rating, and profile image.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getPublicProfile(@Param('id') userId: string) {
    return this.authService.getPublicProfile(userId);
  }
}
