import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../entities/user.entity';
import {
  SendOtpDto,
  VerifyOtpDto,
  AuthResponseDto,
  RefreshTokenDto,
  CreateUserDto,
  UpdateUserProfileDto,
  UserResponseDto,
} from '../dto/auth.dto';
import { SmsService } from '../../notifications/services/sms.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private smsService: SmsService,
  ) {}

  /**
   * Send OTP to user's phone number
   * @param sendOtpDto - Phone number
   * @returns Message confirming OTP sent
   */
  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    const { phoneNumber } = sendOtpDto;

    try {
      // ====================================================================
      // Check rate limiting (max 3 OTP requests per 5 minutes)
      // ====================================================================
      const rateLimitKey = `otp:rate-limit:${phoneNumber}`;
      const attempts = await this.cacheManager.get<number>(rateLimitKey);

      if (attempts && attempts >= 3) {
        throw new BadRequestException(
          'Too many OTP requests. Please try again in 5 minutes.',
        );
      }

      // ====================================================================
      // Generate 6-digit OTP
      // ====================================================================
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // ====================================================================
      // Store OTP in cache for verification
      // ====================================================================
      const otpKey = `otp:${phoneNumber}`;
      await this.cacheManager.set(otpKey, otp, 10 * 60 * 1000); // 10 minutes

      // ====================================================================
      // Update rate limiting
      // ====================================================================
      const newAttempts = (attempts || 0) + 1;
      await this.cacheManager.set(rateLimitKey, newAttempts, 5 * 60 * 1000); // 5 minutes

      // ====================================================================
      // Send OTP via SMS
      // ====================================================================
      try {
        await this.smsService.sendOtp(phoneNumber, otp);
        this.logger.log(`OTP sent successfully to ${phoneNumber}`);
      } catch (error) {
        this.logger.error(
          `Failed to send OTP to ${phoneNumber}: ${error.message}`,
        );
        // For development, log the OTP
        if (this.configService.get('NODE_ENV') === 'development') {
          this.logger.warn(`[DEV] OTP for ${phoneNumber}: ${otp}`);
        }
      }

      return {
        message: `OTP sent to ${phoneNumber}. Valid for 10 minutes.`,
      };
    } catch (error) {
      this.logger.error(`Error sending OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verify OTP and return JWT tokens
   * @param verifyOtpDto - Phone number and OTP code
   * @returns JWT tokens and user data
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { phoneNumber, otp } = verifyOtpDto;

    try {
      // ====================================================================
      // Get OTP from cache
      // ====================================================================
      const otpKey = `otp:${phoneNumber}`;
      const cachedOtp = await this.cacheManager.get<string>(otpKey);

      if (!cachedOtp) {
        throw new BadRequestException(
          'OTP expired or not found. Please request a new OTP.',
        );
      }

      // ====================================================================
      // Verify OTP
      // ====================================================================
      if (cachedOtp !== otp) {
        throw new BadRequestException('Invalid OTP code.');
      }

      // ====================================================================
      // Delete OTP from cache
      // ====================================================================
      await this.cacheManager.del(otpKey);

      // ====================================================================
      // Find or create user
      // ====================================================================
      let user = await this.userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        // Create new user
        user = this.userRepository.create({
          id: uuidv4(),
          phoneNumber,
          firstName: 'User',
          lastName: phoneNumber,
          city: 'Baghdad',
          isVerified: true,
          status: 'active',
        });
        await this.userRepository.save(user);
        this.logger.log(`New user created: ${phoneNumber}`);
      } else {
        // Update last login
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
      }

      // ====================================================================
      // Generate JWT tokens
      // ====================================================================
      const tokens = this.generateTokens(user);

      // ====================================================================
      // Save refresh token to database
      // ====================================================================
      user.refreshToken = tokens.refreshToken;
      user.refreshTokenExpiry = new Date(
        Date.now() +
          parseInt(this.configService.get('JWT_REFRESH_EXPIRE', '30d')) *
            24 *
            60 *
            60 *
            1000,
      );
      await this.userRepository.save(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
        user: this.mapUserToResponse(user),
      };
    } catch (error) {
      this.logger.error(`Error verifying OTP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   * @param refreshTokenDto - Refresh token
   * @returns New JWT tokens
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    const { refreshToken } = refreshTokenDto;

    try {
      // ====================================================================
      // Verify refresh token
      // ====================================================================
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // ====================================================================
      // Find user
      // ====================================================================
      const user = await this.userRepository.findOne({
        where: { id: decoded.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      if (
        user.refreshTokenExpiry &&
        user.refreshTokenExpiry < new Date()
      ) {
        throw new UnauthorizedException('Refresh token expired.');
      }

      // ====================================================================
      // Generate new tokens
      // ====================================================================
      const tokens = this.generateTokens(user);

      // ====================================================================
      // Update refresh token in database
      // ====================================================================
      user.refreshToken = tokens.refreshToken;
      user.refreshTokenExpiry = new Date(
        Date.now() +
          30 *
            24 *
            60 *
            60 *
            1000,
      );
      await this.userRepository.save(user);

      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: 7 * 24 * 60 * 60,
        user: this.mapUserToResponse(user),
      };
    } catch (error) {
      this.logger.error(`Error refreshing token: ${error.message}`);
      throw new UnauthorizedException('Failed to refresh token.');
    }
  }

  /**
   * Logout user
   * @param userId - User ID
   * @returns Logout confirmation
   */
  async logout(userId: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (user) {
        user.refreshToken = null;
        user.refreshTokenExpiry = null;
        user.deviceToken = null;
        await this.userRepository.save(user);
      }

      return { message: 'Logged out successfully.' };
    } catch (error) {
      this.logger.error(`Error logging out: ${error.message}`);
      throw new InternalServerErrorException('Failed to logout.');
    }
  }

  /**
   * Get current user profile
   * @param userId - User ID
   * @returns User data
   */
  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    return this.mapUserToResponse(user);
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param updateDto - Update data
   * @returns Updated user data
   */
  async updateProfile(
    userId: string,
    updateDto: UpdateUserProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    // Update fields
    if (updateDto.firstName) user.firstName = updateDto.firstName;
    if (updateDto.lastName) user.lastName = updateDto.lastName;
    if (updateDto.city) user.city = updateDto.city;
    if (updateDto.profileImage) user.profileImage = updateDto.profileImage;

    await this.userRepository.save(user);

    return this.mapUserToResponse(user);
  }

  /**
   * Get user public profile
   * @param userId - User ID
   * @returns Public user data
   */
  async getPublicProfile(userId: string): Promise<Partial<UserResponseDto>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    const response = this.mapUserToResponse(user);
    // Remove sensitive data from public profile
    delete response['email'];
    return response;
  }

  // ========================================================================
  // PRIVATE HELPER METHODS
  // ========================================================================

  /**
   * Generate JWT tokens (access and refresh)
   * @param user - User entity
   * @returns Access and refresh tokens
   */
  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = {
      sub: user.id,
      phoneNumber: user.phoneNumber,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRE', '7d'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE', '30d'),
    });

    return { accessToken, refreshToken };
  }

  /**
   * Map User entity to UserResponseDto
   * @param user - User entity
   * @returns DTO
   */
  private mapUserToResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      city: user.city,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      rating: user.rating ? Number(user.rating) : 0,
      completedTransactions: user.completedTransactions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
