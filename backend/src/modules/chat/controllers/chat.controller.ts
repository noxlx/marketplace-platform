import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ChatService } from '../services/chat.service';
import {
  ChatMessageDto,
  ConversationDto,
  ConversationsResponseDto,
  MessagesResponseDto,
  SendMessageDto,
  StartConversationDto,
} from '../dto/chat.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Start or get an existing listing conversation' })
  @ApiResponse({ status: 201, type: ConversationDto })
  async startConversation(
    @CurrentUser() userId: string,
    @Body() dto: StartConversationDto,
  ): Promise<ConversationDto> {
    return this.chatService.startConversation(userId, dto.listingId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get my conversations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: ConversationsResponseDto })
  async findMine(
    @CurrentUser() userId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ): Promise<ConversationsResponseDto> {
    return this.chatService.findMine(userId, page, pageSize);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, type: MessagesResponseDto })
  async getMessages(
    @CurrentUser() userId: string,
    @Param('conversationId') conversationId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50,
  ): Promise<MessagesResponseDto> {
    return this.chatService.getMessages(userId, conversationId, page, pageSize);
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  @ApiResponse({ status: 201, type: ChatMessageDto })
  async sendMessage(
    @CurrentUser() userId: string,
    @Param('conversationId') conversationId: string,
    @Body() dto: SendMessageDto,
  ): Promise<ChatMessageDto> {
    return this.chatService.sendMessage(userId, conversationId, dto.messageText);
  }

  @Put('conversations/:conversationId/read')
  @ApiOperation({ summary: 'Mark received messages in a conversation as read' })
  @ApiParam({ name: 'conversationId', description: 'Conversation ID' })
  async markRead(
    @CurrentUser() userId: string,
    @Param('conversationId') conversationId: string,
  ): Promise<{ updated: number }> {
    return this.chatService.markRead(userId, conversationId);
  }
}
