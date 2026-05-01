# Flutter Mobile App - Iraqi Marketplace

A full-featured Flutter mobile app for browsing, creating, and managing classified marketplace listings.

## Features

- 🔐 **OTP Authentication** - Sign in with phone number and OTP
- 🏠 **Browse Listings** - Search and filter marketplace listings
- ➕ **Create Listings** - Post new items to the marketplace
- ❤️ **Favorites** - Save your favorite listings
- 🔔 **Notifications** - Real-time alerts for marketplace activity
- 📊 **Admin Dashboard** - View marketplace statistics (admin only)
- 🎨 **Material Design 3** - Modern, responsive UI
- 🔄 **State Management** - Provider pattern for reactive updates
- 💾 **Token Storage** - Secure local storage of authentication tokens

## Tech Stack

- **Framework**: Flutter (SDK >=3.2.0 <4.0.0)
- **State Management**: Provider (v6.2.0)
- **HTTP Client**: http (v1.2.0)
- **Storage**: shared_preferences (v2.2.2)
- **Date/Time**: intl (v0.20.0)
- **Environment**: flutter_dotenv (v5.1.0)

## Getting Started

### Prerequisites

- Flutter SDK 3.2.0 or higher
- Dart 3.2.0 or higher
- Android Studio / Xcode (for emulator/simulator)
- A running backend API (see [backend docs](../backend/README.md))

### Installation

1. **Navigate to the mobile app directory:**
   ```bash
   cd frontend-mobile
   ```

2. **Install dependencies:**
   ```bash
   flutter pub get
   ```

3. **Create environment configuration:**
   ```bash
   cp .env.example .env
   ```

4. **Update API URL (if needed):**
   Edit `.env` and set the `API_URL` to your backend API:
   ```
   # For local development:
   API_URL=http://10.0.2.2:3000
   
   # For production:
   API_URL=https://api.marketplace.example.com
   ```

5. **Run the app:**
   ```bash
   flutter run
   ```

## Running the App

### On Android Emulator

```bash
# List available emulators
flutter emulators

# Launch emulator
flutter emulators launch <emulator_name>

# Run the app
flutter run
```

### On iOS Simulator

```bash
# Launch simulator
open -a Simulator

# Run the app
flutter run
```

### On Physical Device

1. Enable USB debugging on your device
2. Connect via USB
3. Run: `flutter run`

## Viewing the Live App UI

### Option 1: Hot Reload (Recommended)
```bash
flutter run
```
The app will build and run on your emulator/device. Press:
- `r` to hot reload (apply changes without restarting)
- `R` to hot restart (reset app state)
- `q` to quit

### Option 2: Interactive Web Preview
```bash
flutter run -d web
```
This runs the Flutter app in your browser for quick UI testing.

### Option 3: Flutter DevTools
```bash
# In a separate terminal
flutter pub global activate devtools
devtools

# From your app's terminal
# The URL will be provided - open it in your browser to:
# - Inspect the widget tree
# - View logs and profiling
# - Debug memory usage
```

### Option 4: Taking Screenshots
```bash
# Take a screenshot of the current app state
flutter screenshot

# Screenshot will be saved as "flutter_<timestamp>.png"
```

## Project Structure

```
frontend-mobile/
├── lib/
│   ├── main.dart                      # App entry point
│   ├── screens/
│   │   └── home_screen.dart          # Main marketplace screen
│   ├── models/
│   │   ├── auth_user.dart            # User model
│   │   ├── category.dart             # Category model
│   │   ├── listing.dart              # Listing model
│   │   └── notification_item.dart    # Notification model
│   ├── services/
│   │   └── api_client.dart           # HTTP API client
│   ├── providers/
│   │   ├── auth_provider.dart        # Authentication state
│   │   ├── marketplace_provider.dart # Marketplace state
│   │   ├── token_storage.dart        # Token persistence
│   │   └── demo_data.dart            # Demo/fallback data
│   └── widgets/
│       ├── auth_sheet.dart           # OTP sign-in widget
│       ├── create_listing_sheet.dart # Create listing form
│       └── listing_card.dart         # Listing display card
├── pubspec.yaml                      # Dependencies
└── .env.example                      # Environment template
```

## Key Components

### Authentication Flow
1. User enters phone number
2. OTP is sent via SMS
3. User verifies with OTP code
4. Authentication token is saved locally
5. User can now create listings and interact with the app

### State Management
- **AuthProvider**: Manages authentication state and token storage
- **MarketplaceProvider**: Manages listings, categories, and notifications
- All state is automatically persisted to local storage

### API Integration
- The app communicates with the backend API at `/api/v1/`
- All endpoints require authentication with Bearer token
- Fallback to demo data if API is unavailable

## Testing

### Running Tests
```bash
flutter test
```

### Building for Production

**Android:**
```bash
flutter build apk
# Output: build/app/outputs/flutter-apk/app-release.apk

# Or for App Bundle (recommended for Play Store):
flutter build appbundle
# Output: build/app/outputs/bundle/release/app-release.aab
```

**iOS:**
```bash
flutter build ios
# Output: build/ios/iphoneos/Runner.app
```

## Troubleshooting

### App fails to connect to API
- Check that the backend is running on the correct URL
- Verify `.env` file has the correct `API_URL`
- Check network connectivity on your device/emulator
- For Android emulator, use `http://10.0.2.2:3000` (not `localhost`)

### Hot reload not working
- Press `R` for hot restart instead
- Rebuild if you made changes to native code

### Dependencies not resolving
```bash
flutter pub get
flutter pub upgrade
```

### Build cache issues
```bash
flutter clean
flutter pub get
flutter run
```

## Development Tips

### Logging
- Use `print()` for debug output
- View logs with `flutter logs`
- Use DevTools for advanced debugging

### API Testing
- The app includes demo/fallback data
- Sign in with any phone number (OTP sent to console)
- Use admin account to see admin dashboard

### Adding New Features
1. Create models in `lib/models/`
2. Add API methods to `lib/services/api_client.dart`
3. Create providers in `lib/providers/` if needed
4. Build UI widgets in `lib/widgets/` or `lib/screens/`
5. Wire up with existing providers

## Contributing

Follow these guidelines:
- Use `flutter format` for code formatting
- Run `flutter analyze` to check for issues
- Keep components focused and reusable
- Use Provider pattern for state management
- Document complex logic with comments

## Deployment

See [PHASE8_MOBILE_APP.md](../../PHASE8_MOBILE_APP.md) for complete deployment instructions.

## Support

For issues or questions:
1. Check the [API documentation](../../docs/API.md)
2. Review [architecture docs](../../docs/ARCHITECTURE.md)
3. Check backend [setup guide](../backend/README.md)

## License

Proprietary - Iraqi Marketplace Platform
