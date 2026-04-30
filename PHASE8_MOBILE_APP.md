# Phase 8 Implementation - Mobile App

## Implementation Status

The Flutter mobile app source has been scaffolded with a functional marketplace experience that mirrors the web frontend and backend API.

Flutter/Dart are not installed in this environment, so the app could not be compiled here. The source is ready for `flutter create`, `flutter pub get`, and device/emulator testing on a machine with Flutter installed.

## Files Created

```text
frontend-mobile/
|-- analysis_options.yaml
|-- pubspec.yaml
`-- lib/
    |-- main.dart
    |-- models/
    |   |-- auth_user.dart
    |   |-- category.dart
    |   |-- listing.dart
    |   `-- notification_item.dart
    |-- screens/
    |   `-- home_screen.dart
    |-- services/
    |   `-- api_client.dart
    `-- widgets/
        |-- auth_sheet.dart
        |-- create_listing_sheet.dart
        `-- listing_card.dart
```

## Experience Built

- Material 3 mobile app shell.
- Browse/search listings screen.
- Category chips and city/query filters.
- Demo listing fallback when backend is unavailable.
- OTP sign-in bottom sheet wired to backend auth endpoints.
- Create listing bottom sheet wired to backend listing creation.
- Favorite listing action wired to backend favorites endpoint.
- Notifications tab wired to backend notifications.
- Admin stats tab wired to backend admin stats.

## API Integration

Default API URL:

```text
http://10.0.2.2:3000
```

That default works for Android Emulator talking to a backend on the host machine.

Override it at build/run time:

```text
flutter run --dart-define=API_URL=http://localhost:3000
flutter run --dart-define=API_URL=http://YOUR_LAN_IP:3000
```

## Commands

Because platform folders are not generated yet, run this once from `frontend-mobile` on a Flutter-enabled machine:

```text
flutter create .
flutter pub get
flutter analyze
flutter run --dart-define=API_URL=http://10.0.2.2:3000
```

## Verification

Static file checks were completed in this environment.

Not run here:

```text
flutter analyze
flutter test
flutter run
```

Reason: Flutter and Dart CLIs are not installed.

## Next Steps

1. Generate platform folders with `flutter create .`.
2. Run `flutter analyze` and fix any SDK-version-specific lint issues.
3. Add persistent token storage with `flutter_secure_storage`.
4. Add dedicated listing detail, chat conversation, favorites, and profile screens.
5. Add image picking/upload once backend storage is implemented.
