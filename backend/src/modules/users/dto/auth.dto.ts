import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty, MinLength, Matches } from 'class-validator';

// ============================================================================
// SEND OTP DTO
// ============================================================================
export class SendOtpDto {
  @ApiProperty({
    example: '+964771234567',
    description: 'Iraqi phone number in international format',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IQ', { message: 'Must be a valid Iraqi phone number' })
  phoneNumber: string;
}

// ============================================================================
// VERIFY OTP DTO
// ============================================================================
export class VerifyOtpDto {
  @ApiProperty({
    example: '+964771234567',
    description: 'Iraqi phone number in international format',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IQ')
  phoneNumber: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code sent to phone',
  })
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  otp: string;
}

// ============================================================================
// AUTH RESPONSE DTO
// ============================================================================
export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: 86400,
    description: 'Token expiration in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      phoneNumber: '+964771234567',
      firstName: 'Ahmad',
      lastName: 'Al-Iraqi',
      city: 'Baghdad',
      profileImage: null,
      isVerified: false,
      rating: 0,
      createdAt: '2026-04-30T12:00:00Z',
    },
    description: 'User details',
  })
  user: {
    id: string;
    phoneNumber: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    profileImage?: string;
    isVerified: boolean;
    rating: number;
    createdAt: Date;
  };
}

// ============================================================================
// REFRESH TOKEN DTO
// ============================================================================
export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token from login response',
  })
  @IsNotEmpty()
  refreshToken: string;
}

// ============================================================================
// CREATE USER DTO
// ============================================================================
export class CreateUserDto {
  @ApiProperty({
    example: '+964771234567',
    description: 'Iraqi phone number',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IQ')
  phoneNumber: string;

  @ApiProperty({
    example: 'Ahmad',
    description: 'First name',
  })
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Al-Iraqi',
    description: 'Last name',
  })
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: 'Baghdad',
    description: 'City name',
  })
  @IsNotEmpty()
  @MinLength(2)
  city: string;
}

// ============================================================================
// UPDATE USER PROFILE DTO
// ============================================================================
export class UpdateUserProfileDto {
  @ApiProperty({
    example: 'Ahmad',
    description: 'First name',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    example: 'Al-Iraqi',
    description: 'Last name',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    example: 'Baghdad',
    description: 'City',
    required: false,
  })
  city?: string;

  @ApiProperty({
    example: 'https://r2.marketplace.iq/profiles/user123.jpg',
    description: 'Profile image URL',
    required: false,
  })
  profileImage?: string;
}

// ============================================================================
// USER RESPONSE DTO
// ============================================================================
export class UserResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID (UUID)',
  })
  id: string;

  @ApiProperty({
    example: '+964771234567',
    description: 'Phone number',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'Ahmad',
    description: 'First name',
  })
  firstName: string;

  @ApiProperty({
    example: 'Al-Iraqi',
    description: 'Last name',
  })
  lastName: string;

  @ApiProperty({
    example: 'Baghdad',
    description: 'City',
  })
  city: string;

  @ApiProperty({
    example: 'https://r2.marketplace.iq/profiles/user123.jpg',
    description: 'Profile image URL',
    nullable: true,
  })
  profileImage: string | null;

  @ApiProperty({
    example: false,
    description: 'Is phone number verified',
  })
  isVerified: boolean;

  @ApiProperty({
    example: 4.8,
    description: 'Average seller rating (0-5)',
  })
  rating: number;

  @ApiProperty({
    example: 15,
    description: 'Number of completed transactions',
  })
  completedTransactions: number;

  @ApiProperty({
    example: '2026-04-30T12:00:00Z',
    description: 'Account creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-04-30T12:00:00Z',
    description: 'Last updated date',
  })
  updatedAt: Date;
}
