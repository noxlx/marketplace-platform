import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class StartConversationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'Is this still available?' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  messageText: string;
}

export class ConversationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  listingId: string;

  @ApiProperty()
  buyerId: string;

  @ApiProperty()
  sellerId: string;

  @ApiProperty({ required: false })
  lastMessageAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ChatMessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conversationId: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  messageText: string;

  @ApiProperty()
  isRead: boolean;

  @ApiProperty({ required: false })
  readAt?: Date;

  @ApiProperty()
  createdAt: Date;
}

export class ConversationsResponseDto {
  @ApiProperty({ isArray: true, type: ConversationDto })
  data: ConversationDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}

export class MessagesResponseDto {
  @ApiProperty({ isArray: true, type: ChatMessageDto })
  data: ChatMessageDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  totalPages: number;
}
