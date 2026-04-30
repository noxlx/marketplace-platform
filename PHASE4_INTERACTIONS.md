# Phase 4 Implementation - Favorites & Ratings

## Implementation Status

Favorites and reviews/ratings backend support has been added.

## Files Created

```text
backend/src/modules/favorites/
|-- controllers/favorites.controller.ts
|-- dto/favorite.dto.ts
|-- entities/favorite.entity.ts
|-- services/favorites.service.ts
`-- favorites.module.ts

backend/src/modules/reviews/
|-- controllers/reviews.controller.ts
|-- dto/review.dto.ts
|-- entities/review.entity.ts
|-- services/reviews.service.ts
`-- reviews.module.ts
```

## Updated Files

```text
backend/package.json                         # Added @elastic/elasticsearch
backend/package-lock.json                    # Generated locally by npm install; ignored by git
backend/src/app.module.ts                    # Registered FavoritesModule and ReviewsModule
backend/src/config/database.config.ts        # Registered Favorite and Review entities
backend/src/common/guards/jwt-auth.guard.ts  # Made guard usable from all feature modules
backend/src/modules/listings/entities/listing.entity.ts
backend/src/modules/users/entities/user.entity.ts
```

## API Endpoints

### Favorites

```text
GET    /api/v1/favorites/me
GET    /api/v1/favorites/:listingId/status
POST   /api/v1/favorites/:listingId
DELETE /api/v1/favorites/:listingId
```

All favorites endpoints require a bearer token.

### Reviews

```text
POST   /api/v1/reviews
GET    /api/v1/reviews/users/:userId
GET    /api/v1/reviews/users/:userId/summary
GET    /api/v1/reviews/listings/:listingId
DELETE /api/v1/reviews/:reviewId
```

Creating and deleting reviews require a bearer token.

## Behavior

- A user can favorite a listing once.
- Adding a favorite increments `listings.favoritesCount`.
- Removing a favorite decrements `listings.favoritesCount`.
- A user cannot review themselves.
- A user can review a listing only once.
- The reviewed user must own the reviewed listing.
- Creating or deleting a review recalculates the reviewed user's average `rating` and `totalReviews`.

## Verification

```text
cd backend
npm install
npm run build
```

Build status: passing.

## Next Steps

1. Add explicit database migrations for favorites/reviews if `synchronize` is disabled outside development.
2. Optionally wire favorites/reviews changes into Elasticsearch reindexing if search results should reflect counts instantly.
3. Revisit Redis cache storage for production; the current build-safe config uses the default in-memory cache.
