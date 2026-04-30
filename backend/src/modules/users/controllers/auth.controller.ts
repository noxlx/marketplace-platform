import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  SendOtpDto,
  VerifyOtpDto,
  AuthResponseDto,
  RefreshTokenDto,
  UpdateUserProfileDto,
  UserResponseDto,
} from '../dto/auth.dto';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Send OTP to phone number
   * Used for initial login or phone verification
   */
  @Post('send-otp')
  @ApiOperation({
    summary: 'Send OTP to phone number',
    description:
      'Send a 6-digit OTP code to the user\'s phone number via SMS. Valid for 10 minutes.',
  })
  @ApiResponse({
    status: 201,
    description: 'OTP sent successfully',
    schema: {
      example: {
        message: 'OTP sent to +964771234567. Valid for 10 minutes.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid phone number or rate limit exceeded',
  })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto);
  }

  /**
   * Verify OTP and get JWT tokens
   * Used after receiving OTP via SMS
   */
  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP and get JWT tokens',
    description:
      'Verify the OTP code received via SMS. Returns JWT access token, refresh token, and user data.',
  })
  @ApiResponse({
    status: 201,
    description: 'OTP verified successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or phone number',
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  /**
   * Refresh access token
   * Use refresh token to get new access token
   */
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Use the refresh token to get a new access token. Useful when access token expires.',
  })
  @ApiResponse({
    status: 201,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  /**
   * Logout user
   * Invalidates the refresh token
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Logout the user and invalidate the refresh token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Logged out successfully',
    schema: {
      example: {
        message: 'Logged out successfully.',
      },
    },
  })
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.sub);
  }

  /**
   * Get current user profile
   * Protected route - requires valid JWT token
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Get the profile information of the authenticated user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  async getCurrentUser(@Request() req: any): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(req.user.sub);
  }

  /**
   * Update user profile
   * Protected route - requires valid JWT token
   */
  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update user profile',
    description:
      'Update the profile information of the authenticated user. All fields are optional.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateProfile(
    @Request() req: any,
    @Body() updateDto: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    return this.authService.updateProfile(req.user.sub, updateDto);
  }
}
