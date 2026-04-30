import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private readonly logger = new Logger('SmsService');
  private twilioClient: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get('TWILLIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILLIO_AUTH_TOKEN');

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    }
  }

  /**
   * Send OTP code via SMS
   * @param phoneNumber - Recipient phone number in international format
   * @param otp - OTP code
   * @returns SMS send result
   */
  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    try {
      if (!this.twilioClient) {
        throw new BadRequestException('SMS service not configured');
      }

      const fromNumber = this.configService.get(
        'TWILLIO_PHONE_NUMBER',
        '+1234567890',
      );
      const message = `Your Iraqi Marketplace verification code is: ${otp}\n\nValid for 10 minutes.`;

      const result = await this.twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber,
      });

      this.logger.log(`OTP sent successfully. Message SID: ${result.sid}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS: ${error.message}`);
      throw new BadRequestException('Failed to send SMS');
    }
  }

  /**
   * Send custom SMS message
   * @param phoneNumber - Recipient phone number
   * @param message - Message to send
   * @returns SMS send result
   */
  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      if (!this.twilioClient) {
        this.logger.warn(
          'SMS service not configured. Message not sent (dev mode)',
        );
        return;
      }

      const fromNumber = this.configService.get(
        'TWILLIO_PHONE_NUMBER',
        '+1234567890',
      );

      await this.twilioClient.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber,
      });

      this.logger.log(`Message sent successfully to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      throw new BadRequestException('Failed to send message');
    }
  }
}
