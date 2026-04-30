import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { NotificationsService } from '../../notifications/services/notifications.service';
import {
  ChatMessageDto,
  ConversationDto,
  ConversationsResponseDto,
  MessagesResponseDto,
} from '../dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationsRepository: Repository<Conversation>,
    @InjectRepository(ChatMessage)
    private messagesRepository: Repository<ChatMessage>,
    @InjectRepository(Listing)
    private listingsRepository: Repository<Listing>,
    private notificationsService: NotificationsService,
  ) {}

  async startConversation(userId: string, listingId: string): Promise<ConversationDto> {
    const listing = await this.listingsRepository.findOne({ where: { id: listingId } });
    if (!listing) {
      throw new NotFoundException(`Listing with id '${listingId}' not found`);
    }

    if (listing.userId === userId) {
      throw new BadRequestException('You cannot start a conversation with yourself');
    }

    let conversation = await this.conversationsRepository.findOne({
      where: {
        listingId,
        buyerId: userId,
        sellerId: listing.userId,
      },
    });

    if (!conversation) {
      conversation = await this.conversationsRepository.save({
        listingId,
        buyerId: userId,
        sellerId: listing.userId,
      });
    }

    return this.mapConversation(conversation);
  }

  async findMine(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<ConversationsResponseDto> {
    const skip = (page - 1) * pageSize;
    const [conversations, total] = await this.conversationsRepository
      .createQueryBuilder('conversation')
      .where('conversation.buyerId = :userId OR conversation.sellerId = :userId', { userId })
      .orderBy('conversation.lastMessageAt', 'DESC', 'NULLS LAST')
      .addOrderBy('conversation.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data: conversations.map((conversation) => this.mapConversation(conversation)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getMessages(
    userId: string,
    conversationId: string,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<MessagesResponseDto> {
    await this.assertParticipant(userId, conversationId);
    const skip = (page - 1) * pageSize;
    const [messages, total] = await this.messagesRepository.findAndCount({
      where: { conversationId },
      order: { createdAt: 'ASC' },
      skip,
      take: pageSize,
    });

    return {
      data: messages.map((message) => this.mapMessage(message)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async sendMessage(
    userId: string,
    conversationId: string,
    messageText: string,
  ): Promise<ChatMessageDto> {
    const conversation = await this.assertParticipant(userId, conversationId);
    const text = messageText.trim();

    if (!text) {
      throw new BadRequestException('Message cannot be empty');
    }

    const message = await this.messagesRepository.save({
      conversationId,
      senderId: userId,
      messageText: text,
      isRead: false,
    });

    conversation.lastMessageAt = new Date();
    await this.conversationsRepository.save(conversation);

    const recipientId = conversation.buyerId === userId ? conversation.sellerId : conversation.buyerId;
    await this.notificationsService.create({
      userId: recipientId,
      type: 'message',
      title: 'New message',
      message: text,
      relatedId: conversationId,
    });

    return this.mapMessage(message);
  }

  async markRead(userId: string, conversationId: string): Promise<{ updated: number }> {
    await this.assertParticipant(userId, conversationId);
    const result = await this.messagesRepository
      .createQueryBuilder()
      .update(ChatMessage)
      .set({ isRead: true, readAt: new Date() })
      .where('conversationId = :conversationId', { conversationId })
      .andWhere('senderId != :userId', { userId })
      .andWhere('isRead = false')
      .execute();

    return { updated: result.affected || 0 };
  }

  private async assertParticipant(userId: string, conversationId: string): Promise<Conversation> {
    const conversation = await this.conversationsRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with id '${conversationId}' not found`);
    }

    if (conversation.buyerId !== userId && conversation.sellerId !== userId) {
      throw new ForbiddenException('You are not part of this conversation');
    }

    return conversation;
  }

  private mapConversation(conversation: Conversation): ConversationDto {
    return {
      id: conversation.id,
      listingId: conversation.listingId,
      buyerId: conversation.buyerId,
      sellerId: conversation.sellerId,
      lastMessageAt: conversation.lastMessageAt,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }

  private mapMessage(message: ChatMessage): ChatMessageDto {
    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      messageText: message.messageText,
      isRead: message.isRead,
      readAt: message.readAt,
      createdAt: message.createdAt,
    };
  }
}
