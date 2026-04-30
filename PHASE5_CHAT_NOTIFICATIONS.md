# Phase 5 Implementation - Chat & Notifications

## Implementation Status

Chat conversations, messages, and in-app notifications have been added to the backend.

## Files Created

```text
backend/src/modules/chat/
|-- controllers/chat.controller.ts
|-- dto/chat.dto.ts
|-- entities/chat-message.entity.ts
|-- entities/conversation.entity.ts
|-- services/chat.service.ts
`-- chat.module.ts

backend/src/modules/notifications/
|-- controllers/notifications.controller.ts
|-- dto/notification.dto.ts
|-- entities/notification.entity.ts
|-- services/notifications.service.ts
`-- notifications.module.ts
```

## Updated Files

```text
backend/src/app.module.ts
backend/src/config/database.config.ts
backend/src/modules/listings/entities/listing.entity.ts
backend/src/modules/users/entities/user.entity.ts
backend/src/modules/users/users.module.ts
```

## API Endpoints

### Chat

```text
POST /api/v1/chat/conversations
GET  /api/v1/chat/conversations
GET  /api/v1/chat/conversations/:conversationId/messages
POST /api/v1/chat/conversations/:conversationId/messages
PUT  /api/v1/chat/conversations/:conversationId/read
```

All chat endpoints require a bearer token.

### Notifications

```text
GET /api/v1/notifications/me
GET /api/v1/notifications/me/unread-count
PUT /api/v1/notifications/me/read-all
PUT /api/v1/notifications/:notificationId/read
```

All notification endpoints require a bearer token.

## Behavior

- A buyer can start one conversation per listing/seller pair.
- Listing owners cannot start conversations with themselves.
- Only the buyer or seller can read or send messages in a conversation.
- Sending a message updates `lastMessageAt`.
- Sending a message creates an in-app notification for the other participant.
- Users can list notifications, filter unread notifications, get unread counts, and mark notifications read.

## Verification

```text
cd backend
npm run build
```

Build status: passing.

## Next Steps

1. Add WebSocket gateway for real-time message delivery.
2. Add explicit migrations for chat and notification entities if `synchronize` is disabled.
3. Add push notification delivery using `deviceToken` once Firebase/APNs credentials exist.
