# Phase 6 Implementation - Admin & Reports

## Implementation Status

Admin dashboard APIs, moderation actions, audit logs, and user-generated reports have been added.

## Files Created

```text
backend/src/modules/admin/
|-- controllers/admin.controller.ts
|-- dto/admin.dto.ts
|-- entities/admin-log.entity.ts
|-- guards/admin.guard.ts
|-- services/admin.service.ts
`-- admin.module.ts

backend/src/modules/reports/
|-- controllers/reports.controller.ts
|-- dto/report.dto.ts
|-- entities/report.entity.ts
|-- services/reports.service.ts
`-- reports.module.ts
```

## Updated Files

```text
backend/src/app.module.ts
backend/src/config/database.config.ts
backend/src/modules/listings/entities/listing.entity.ts
backend/src/modules/users/entities/user.entity.ts
```

## API Endpoints

### Reports

```text
POST /api/v1/reports
GET  /api/v1/reports/me
GET  /api/v1/reports/admin
PUT  /api/v1/reports/admin/:reportId/status
```

Users can submit and view their own reports. Admin report review routes require `role = admin`.

### Admin

```text
GET /api/v1/admin/stats
GET /api/v1/admin/users
PUT /api/v1/admin/users/:userId/status
PUT /api/v1/admin/users/:userId/role
PUT /api/v1/admin/listings/:listingId/suspend
GET /api/v1/admin/logs
```

All admin endpoints require a bearer token and `role = admin`.

## Behavior

- Users can report a listing, another user, or both.
- Users cannot report themselves.
- Admins can list reports and move them through `pending`, `investigating`, `resolved`, and `dismissed`.
- Admins can suspend or ban users, promote users to admin, and suspend listings.
- Admin moderation actions write to `admin_logs`.
- Admin dashboard stats include users, active users, listings, active listings, pending reports, and conversations.

## Admin Role

`users.role` has been added with default `user`.

For local testing, set a user's role to `admin` directly in the database or use an existing admin account once seeded.

## Verification

```text
cd backend
npm run build
```

Build status: passing.

## Next Steps

1. Add explicit migrations for `users.role`, reports, and admin logs if `synchronize` is disabled.
2. Add seed data or a secure bootstrap flow for the first admin user.
3. Build the admin dashboard frontend against these endpoints.
