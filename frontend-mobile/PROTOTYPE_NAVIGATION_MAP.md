# 🚀 Mobile App Prototype - Quick Reference & Navigation Map

## Bottom Navigation Tabs

```
┌─────────────────────────────────────────┐
│                                         │
│        [ Browse | Messages | Saved | Store | Profile ]
│        
│  Home      Chat        Heart      Shopping  Account
```

---

## Navigation Map

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN NAVIGATION SCREEN                    │
│  (Shows 5 tabs at bottom, displays selected screen)         │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─→ BROWSE SCREEN (Tab 1: House Icon)
       │   ├─→ Listing Detail Screen
       │   │   ├─→ Chat Screen (Contact Seller)
       │   │   └─→ Favorite (Heart icon)
       │   └─→ Search & Filters
       │
       ├─→ CHAT SCREEN (Tab 2: Chat Bubble)
       │   ├─→ Chat Detail Screen (Open conversation)
       │   │   └─→ Send/Receive Messages
       │   └─→ Conversation List
       │
       ├─→ FAVORITES SCREEN (Tab 3: Heart Icon)
       │   └─→ Listing Detail Screen
       │
       ├─→ MY LISTINGS SCREEN (Tab 4: Store Icon)
       │   ├─→ Filter by Status (All, Active, Sold, Archived)
       │   ├─→ Listing Detail Screen
       │   └─→ Popup Menu (Edit, Stats, Renew, Archive, Delete)
       │
       └─→ PROFILE SCREEN (Tab 5: Person Icon)
           ├─→ Sign In (if not authenticated)
           ├─→ Menu Items (Edit, Addresses, Notifications, etc.)
           └─→ Sign Out
```

---

## Screen Details

### 1️⃣ BROWSE SCREEN (Home)
**Location:** `lib/screens/browse_screen.dart`

**Features:**
- Search bar
- Category filter dropdown
- City filter dropdown
- Additional filters button
- Grid view of listings (2 columns)
- Tap listing → Listing Detail

**Demo Data:** 20+ listings

**State:** Public (no login required)

---

### 2️⃣ LISTING DETAIL SCREEN
**Location:** `lib/screens/listing_detail_screen.dart`

**Features:**
- Large listing image
- Title & price
- Category & city badges
- Description
- Seller info with rating
- Statistics (Views, Favorites, Posted)
- Contact Seller button
- Save to Favorites (heart icon)

**Navigation:**
- Contact Seller → Chat
- Back → Browse

**State:** Requires login to contact or favorite

---

### 3️⃣ CHAT SCREEN (Messages)
**Location:** `lib/screens/chat_screen.dart`

**Features:**
- Conversation list
- 3 demo conversations
- Seller name & listing title
- Last message preview
- Unread badges
- Timestamps
- Tap → Chat Detail

**Demo Data:** 3 conversations

---

### 4️⃣ CHAT DETAIL SCREEN
**Location:** `lib/screens/chat_screen.dart` (ChatDetailScreen)

**Features:**
- Message thread
- Send new messages
- Message timestamps
- Sender names
- Sent (blue, right) vs received (gray, left)

**Demo Data:** 3 pre-loaded messages

---

### 5️⃣ FAVORITES SCREEN (Saved)
**Location:** `lib/screens/favorites_screen.dart`

**Features:**
- Grid of saved listings
- 3 demo favorites
- Click to view details
- Sign in prompt if needed

**State:** Requires login

---

### 6️⃣ MY LISTINGS SCREEN (Store)
**Location:** `lib/screens/my_listings_screen.dart`

**Features:**
- Filter tabs: All, Active, Sold, Archived
- Listing list view
- Price, views, status badge
- Popup menu per listing
- 3 demo listings

**State:** Requires login

---

### 7️⃣ PROFILE SCREEN (Account)
**Location:** `lib/screens/profile_screen.dart`

**Features:**
- User avatar & name
- Rating & member since
- Stats (Listings, Views, Followers)
- Menu items
- Sign in/out button

**State:** Shows different content based on auth

---

## Quick Navigation Examples

### Browse → Details → Chat
```
1. Browse Screen → Tap iPhone listing
2. Listing Detail Screen → Click "Contact Seller"
3. Chat Screen → Send message
4. Chat Detail → Type & send message
```

### Browse → Save → Favorites
```
1. Browse Screen → Tap listing
2. Listing Detail → Click heart icon
3. (Redirect to login if needed)
4. Favorites Screen → See saved listing
```

### Login → Profile → My Listings
```
1. Profile Screen → Click "Sign In"
2. Auth Sheet → Enter phone 9647735123456
3. Enter OTP: 000000
4. Back to Profile → See logged in state
5. My Listings → See your listings
```

---

## File Structure

```
frontend-mobile/
├── lib/
│   ├── main.dart                           # App entry & routing
│   ├── screens/
│   │   ├── main_navigation_screen.dart     # 🆕 Bottom nav controller
│   │   ├── browse_screen.dart              # 🆕 Browse listings
│   │   ├── listing_detail_screen.dart      # 🆕 Listing details
│   │   ├── chat_screen.dart                # 🆕 Chat & detail
│   │   ├── favorites_screen.dart           # 🆕 Saved listings
│   │   ├── my_listings_screen.dart         # 🆕 Seller listings
│   │   ├── profile_screen.dart             # 🆕 User profile
│   │   └── home_screen.dart                # (Original)
│   ├── models/                             # (Existing)
│   ├── providers/                          # (Existing)
│   ├── services/                           # (Existing)
│   ├── widgets/                            # (Existing)
│   └── utils/                              # (Existing)
│
├── MOBILE_APP_PROTOTYPE.md                 # 🆕 Full guide
├── QUICKSTART.md                           # (Existing)
└── pubspec.yaml                            # (Existing)

Legend:
🆕 = Newly created for prototype
```

---

## Running the App

```bash
# Navigate to app directory
cd frontend-mobile

# Install dependencies
flutter pub get

# Run the app
flutter run

# Run on specific device
flutter run -d chrome      # Web browser
flutter run -d emulator    # Android emulator
flutter run -d simulator   # iOS simulator
```

---

## Test Credentials

```
Phone: 9647735123456
OTP:   000000
```

---

## Key Classes & Models

### ChatMessage
```dart
class ChatMessage {
  final String id;
  final String senderId;
  final String senderName;
  final String content;
  final DateTime timestamp;
  final bool isOwn;
}
```

### ChatConversation
```dart
class ChatConversation {
  final String id;
  final String otherUserId;
  final String otherUserName;
  final String lastMessage;
  final DateTime lastMessageTime;
  final int unreadCount;
  final String? listingTitle;
  final String? listingImage;
}
```

### Listing (Existing)
```dart
class Listing {
  final String id;
  final String title;
  final String description;
  final double price;
  final String city;
  final String categoryId;
  final String status;
  final int views;
  final int favoritesCount;
  final DateTime createdAt;
  // ... more fields
}
```

---

## Demo Data Summary

### Listings
- 20+ listings across all categories
- All cities (Baghdad, Erbil, Basra, etc.)
- Various prices and conditions

### Conversations
- Ahmed Al-Rashid (iPhone)
- Fatima Hassan (Apartment)
- Mohammed Karim (Car)

### Saved Listings
- iPhone 13 Pro
- Mercedes-Benz C300
- Modern Apartment

---

## Next Steps

After prototype demo:

1. **Connect Backend**
   - Replace mock data with API calls
   - Add real image loading
   - Implement real chat via WebSocket

2. **Add More Features**
   - Photo upload
   - Advanced filters
   - Notifications
   - Payments

3. **Polish & Release**
   - Animations
   - Offline support
   - Performance optimization
   - App Store submission

---

## Helpful Commands

```bash
# Check devices
flutter devices

# Run with verbose output
flutter run -v

# Build release APK (Android)
flutter build apk --release

# Build release app (iOS)
flutter build ios --release

# Clean build
flutter clean
flutter pub get
flutter run

# Format code
dart format lib/

# Check for issues
flutter analyze
```

---

**🎉 Prototype Complete! Ready for backend integration.**
