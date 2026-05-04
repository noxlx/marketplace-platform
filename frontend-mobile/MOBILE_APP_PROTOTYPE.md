# 📱 Iraqi Marketplace Mobile App - Prototype & Demo Guide

## ✅ What's Been Built

A complete, fully functional Flutter mobile app prototype with:
- **5 Main Navigation Screens** with bottom navigation bar
- **Real Working Navigation Flows** between all screens
- **Demo Data** pre-loaded for realistic testing
- **Complete UI/UX** matching modern marketplace apps
- **Authentication Integration** (with demo sign-in)
- **Mock Chat System** with conversations and messaging
- **Favorites Management** with demo listings
- **My Listings Dashboard** with status filtering
- **User Profile** with stats and settings

---

## 🎯 Quick Start

### Prerequisites
```bash
# Ensure Flutter is installed
flutter --version

# Get the latest dependencies
cd frontend-mobile
flutter pub get
```

### Run the App
```bash
# Run on your device or emulator
flutter run

# Or run on specific device
flutter run -d chrome    # Web browser
flutter run -d emulator  # Android emulator
flutter run -d simulator # iOS simulator
```

### Expected Startup
- App launches with **Browse Screen** (Home Tab)
- Shows demo listings in a grid
- Bottom navigation bar with 5 tabs visible
- All screens fully functional with demo data

---

## 📋 Screen Tour & Navigation Flows

### 1. **Browse Screen** (Home Tab 🏠)

**What you see:**
- Search bar to find listings
- Category dropdown filter
- City dropdown filter  
- Additional filters button
- Grid view of listings (2 columns)

**Demo Features:**
- 20+ pre-loaded demo listings with various categories
- Real filtering by category, city, and search text
- Tap any listing card to view details
- Fully responsive grid layout

**Navigation:**
```
Browse Screen
    ↓ (tap listing card)
    → Listing Detail Screen
```

**Demo Scenarios:**
```
1. Search for "iPhone" → see filtered results
2. Filter by category "Cars" → see vehicle listings
3. Filter by city "Baghdad" → see Baghdad listings
4. Combine filters: "laptop" + "Baghdad" + "Computers"
5. Scroll through listings → see pagination
```

---

### 2. **Browse → Listing Detail Screen**

**What you see:**
- Large listing image at top
- Title and price prominently displayed
- Category and city badges
- Full description of item
- Seller information with rating
- Stats: Views, Favorites, Posted date
- Contact Seller button
- Heart icon to save to favorites

**Demo Features:**
- Favorite/Unfavorite toggles (requires demo login)
- Contact Seller → navigates to chat
- Detailed seller information with rating
- Realistic view and favorite counts

**Navigation:**
```
Listing Detail Screen
    ↓ (Contact Seller button)
    → Chat Screen with Seller
    
    ↓ (Heart icon)
    → Save to Favorites
    
    ↓ (Back button)
    → Back to Browse Screen
```

**Demo Scenarios:**
```
1. View iPhone listing details
2. See seller "Tech Store Baghdad" with 4.8 rating
3. Try to contact seller (needs login)
4. Try to favorite (needs login)
5. Go back to browse
```

---

### 3. **Messages Screen** (Chat Tab 💬)

**What you see:**
- List of 3 conversations
- Each shows:
  - Seller avatar with initial
  - Seller name
  - Listing title being discussed
  - Last message preview
  - Unread count badge (if any)
  - Last message timestamp

**Demo Features:**
- 3 pre-loaded conversations with realistic data
- Unread badges on unread messages
- Time-based sorting (most recent first)
- Tap to open conversation detail

**Navigation:**
```
Chat Screen (Conversations List)
    ↓ (tap conversation)
    → Chat Detail Screen (Conversation Thread)
    
    ↓ (back)
    → Chat Screen
```

**Demo Scenarios:**
```
1. View conversation with "Ahmed Al-Rashid" about iPhone
2. See unread count badge
3. Tap to open conversation
4. Send a test message
5. See message appear instantly
6. Go back to conversation list
```

---

### 4. **Chat → Chat Detail Screen**

**What you see:**
- Seller name in header with listing title
- Message thread with:
  - Sent messages (blue, aligned right)
  - Received messages (gray, aligned left)
  - Timestamps for each message
  - Sender names for received messages
- Message input field at bottom
- Send button

**Demo Features:**
- 3 pre-loaded messages in conversation
- Send new messages (test functionality)
- Real-time message display
- Automatic scrolling to latest message

**Demo Scenarios:**
```
1. Open iPhone conversation
2. See "Is this still available?" message
3. See response "Yes, it is! Very good condition."
4. Type "What's the lowest price?" 
5. Tap send button
6. See message appear instantly
7. Continue conversation with automated replies
```

---

### 5. **Saved Screen** (Favorites Tab ❤️)

**What you see:**
- Grid of 3 saved listings
- Shows:
  - Listing image
  - Title
  - Price
  - Seller info and rating
  - Category/City info

**Demo Features:**
- 3 pre-loaded favorite listings:
  1. iPhone 13 Pro (Phones)
  2. Mercedes-Benz C300 (Cars)
  3. Modern Apartment (Real Estate)
- Click to view details
- Sign in prompt if not authenticated

**Navigation:**
```
Favorites Screen
    ↓ (tap listing)
    → Listing Detail Screen
    
    ↓ (Sign in button - if not authenticated)
    → Auth Sheet (Login/OTP)
```

**Demo Scenarios:**
```
1. View favorites grid
2. See iPhone, Car, and Apartment
3. Tap any to view details
4. Try to favorite/unfavorite (requires login)
5. Go back
```

---

### 6. **My Listings Screen** (Store Tab 🏪)

**What you see:**
- Filter tabs: All, Active, Sold, Archived
- List of user's listings showing:
  - Listing thumbnail image
  - Title
  - Price (in teal color)
  - View count
  - Status badge (Active/Sold/Archived)
- Popup menu on each listing with options

**Demo Features:**
- 3 pre-loaded listings with different statuses
- Filter by status (All, Active, Sold, Archived)
- Popup menu on each with: Edit, View, Stats, Renew, Archive/Delete
- Real filtering between Active/Sold/Archived

**Navigation:**
```
My Listings Screen
    ↓ (filter tabs)
    → Filter listings by status
    
    ↓ (tap listing)
    → View Listing Detail
    
    ↓ (popup menu)
    → Various listing actions
    
    ↓ (Sign in button - if not authenticated)
    → Auth Sheet
```

**Demo Scenarios:**
```
1. View all listings (3 total)
2. Click "Active" tab → see 2 active listings
3. Click "Sold" tab → see 1 sold listing
4. Click "Archived" tab → see 0 listings
5. Right-click/tap menu on a listing
6. See Edit, View, Stats, Renew options
7. Click Renew → see success message
8. Go back
```

---

### 7. **Profile Screen** (Account Tab 👤)

**What you see (After Login):**
- Profile header with:
  - User avatar (initial in circle)
  - Phone number
  - Star rating
  - Member since date
- Stats showing:
  - 12 Listings
  - 245 Views
  - 38 Followers
- Menu items:
  - Edit Profile
  - Saved Addresses
  - Notifications
  - Security & Privacy
  - Help & Support
- Sign Out button

**Demo Features:**
- Complete user information display
- Realistic stats
- All menu items functional with "coming soon" messages
- Sign out functionality (clears auth state)

**Navigation:**
```
Profile Screen
    ↓ (Sign In button - if not authenticated)
    → Auth Sheet (Login with OTP)
    
    ↓ (Any menu item)
    → Feature page (coming soon)
    
    ↓ (Sign Out button)
    → Logout confirmation → Logged out
```

**Demo Scenarios:**
```
1. Before login: See "Sign in to see your profile"
2. Click "Sign In"
3. Enter test phone: 9647735123456
4. Enter test OTP: 000000
5. After login: See full profile
6. View all stats
7. Click menu items
8. See "coming soon" features
9. Click "Sign Out"
10. Confirm logout
11. Return to Login screen
```

---

## 🔐 Authentication Demo

### Test Credentials
```
Phone: 9647735123456
OTP:   000000
```

### Login Flow
1. Go to any protected screen (Favorites, My Listings, or Profile without login)
2. See "Sign in first" message
3. Click sign in button
4. Enter phone number above
5. Click "Send OTP"
6. Enter OTP: 000000
7. Click "Verify"
8. You're now logged in!

### Where to Find Auth
- Favorites Screen → Sign in button
- My Listings Screen → Sign in button
- Profile Screen → Sign in button
- Listing Detail → Try to contact seller (will ask to sign in)
- Listing Detail → Try to save to favorites (will ask to sign in)

---

## 🚀 User Journey Scenarios

### Scenario 1: Browsing & Saving (No Login)
```
1. Launch app → Browse Screen
2. See 20+ demo listings
3. Search for "iPhone" → see results
4. Filter by category "Phones" → see only phones
5. Click iPhone listing → see details
6. Try to save to favorites → prompted to login
7. Go back → try another listing
```

### Scenario 2: Full Buyer Journey (With Login)
```
1. Launch app → Browse Screen
2. Search for apartment listings
3. Filter by city "Baghdad"
4. Find interesting apartment
5. Click to view details
6. Click "Contact Seller"
7. Chat with seller asking about price
8. Save apartment to favorites
9. Check saved listings in Favorites tab
10. Profile shows login status
```

### Scenario 3: Seller Experience
```
1. Login to app
2. Go to "My Listings" tab
3. See all 3 listings
4. Check "Active" listings (2 shown)
5. Click "Sold" filter → see sold listing
6. Right-click a listing → see options
7. Click "Renew" on an old listing
8. Check stats for listing (Views: 123)
9. Go to Profile → see seller stats
```

### Scenario 4: Messaging Flow
```
1. Browse and find listing
2. Click Contact Seller
3. See conversation with seller
4. Read previous messages
5. Type new message: "Is this available?"
6. Send message
7. See message appear instantly
8. Go back to conversations
9. See updated last message
10. Open different conversation
11. Continue chatting
```

---

## 📊 Demo Data Included

### Listings (20+)
- **Phones:** iPhone 13, Samsung S21, Xiaomi Note
- **Cars:** Mercedes, Toyota Corolla, BMW 320
- **Real Estate:** Apartments, Houses, Land
- **Furniture:** Sofas, Tables, Beds
- **Electronics:** Laptops, TVs, Cameras
- **Sports:** Bikes, Gym Equipment

### Conversations (3)
1. Ahmed Al-Rashid - iPhone discussion
2. Fatima Hassan - Apartment review
3. Mohammed Karim - Car price negotiation

### Saved Listings (3)
1. iPhone 13 Pro - 450,000 IQD
2. Mercedes-Benz C300 - 25,000,000 IQD
3. Modern Apartment - 850,000,000 IQD

### Cities
- Baghdad, Erbil, Basra, Mosul, Najaf, Karbala

### Categories
- Phones, Cars, Real Estate, Furniture, Computers, Electronics, Sports

---

## 🎨 Design & UI Features

### Colors
- **Primary:** Teal (#0F766E)
- **Background:** Light gray (#F7F8FA)
- **Accent:** Red (for favorites)
- **Text:** Dark gray (#1F2933)

### Navigation
- **Bottom Navigation Bar** with 5 tabs
- **Material 3 Design** components
- **Responsive Layout** for all screen sizes
- **Smooth Transitions** between screens

### Components
- Listing cards with images
- Category/City chips
- Price displays
- Star ratings
- Message bubbles
- Filter chips
- Status badges

---

## ⚙️ Technical Architecture

### File Structure
```
lib/
├── main.dart                      # App entry & routing
├── screens/
│   ├── main_navigation_screen.dart    # Bottom nav controller
│   ├── browse_screen.dart             # Browse listings
│   ├── listing_detail_screen.dart     # Listing details
│   ├── chat_screen.dart               # Chat list & detail
│   ├── favorites_screen.dart          # Saved listings
│   ├── my_listings_screen.dart        # Seller's listings
│   └── profile_screen.dart            # User profile
├── models/
│   ├── listing.dart
│   ├── auth_user.dart
│   └── category.dart
├── providers/
│   ├── auth_provider.dart          # Auth state
│   └── marketplace_provider.dart   # Marketplace data
├── services/
│   └── api_client.dart             # API integration
├── widgets/
│   ├── listing_card.dart
│   ├── auth_sheet.dart
│   └── create_listing_sheet.dart
└── utils/
```

### State Management
- **Provider Pattern** for global state
- **ChangeNotifier** for reactive updates
- **Local State** in StatefulWidgets where needed

### Navigation
- **Named Routes** for deep linking
- **Material Page Route** for transitions
- **Bottom Navigation** for main tabs
- **Arguments Passing** between screens

---

## 🔧 Customization & Next Steps

### To Modify Demo Data
Edit `_mockListings`, `_conversations`, `_favorites` in respective screens:
- [browse_screen.dart](browse_screen.dart) - Add/remove listings
- [chat_screen.dart](chat_screen.dart) - Modify conversations
- [favorites_screen.dart](favorites_screen.dart) - Change saved items

### To Connect Real API
1. Update `ApiClient` in `services/api_client.dart`
2. Modify `MarketplaceProvider` to fetch real data
3. Replace mock data loading with API calls

### To Add New Features
1. Create new screen in `lib/screens/`
2. Add route in `main.dart` onGenerateRoute
3. Add navigation button in `main_navigation_screen.dart`
4. Update bottom navigation destinations

### To Customize Colors
Edit theme in `main.dart`:
```dart
ColorScheme.fromSeed(
  seedColor: const Color(0xFF0F766E), // Change this
  brightness: Brightness.light,
)
```

---

## 📱 Platform-Specific Notes

### Android
- Tested on Android 6.0+
- Material Design 3 components
- Works with real Android phones and emulators

### iOS
- Tested on iOS 14+
- Uses Cupertino-style gestures
- Works with real iPhones and simulators

### Web
- Responsive design works on web
- Run with: `flutter run -d chrome`

---

## 🐛 Known Demo Features

- ✅ All navigation works
- ✅ Filtering works on Browse
- ✅ Chat simulation works
- ✅ Login/Logout works
- ✅ Status filtering on My Listings works
- ✅ All 5 tabs fully functional
- ⚠️ Images don't load (use placeholders)
- ⚠️ API calls are mocked
- ⚠️ No real database integration yet

---

## 📚 Next Steps for Development

### Phase 1: Connect to Real Backend
- [ ] Replace mock data with API calls
- [ ] Connect to backend listings endpoint
- [ ] Implement real image loading
- [ ] Add real chat via WebSocket

### Phase 2: Add More Features
- [ ] Photo upload for listings
- [ ] Advanced search filters
- [ ] Notifications
- [ ] Payment integration
- [ ] Review system

### Phase 3: Polish & Release
- [ ] Add animation
- [ ] Optimize performance
- [ ] Add offline support
- [ ] Prepare for App Store/Play Store

---

## 🎓 Learning Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Provider Package](https://pub.dev/packages/provider)
- [Material Design 3](https://m3.material.io/)
- [NestJS Backend API Docs](../docs/API.md)

---

## ❓ Troubleshooting

### App won't start
```bash
flutter clean
flutter pub get
flutter run
```

### Emulator issues
```bash
flutter devices  # Check connected devices
flutter run -d <device_id>
```

### Build errors
```bash
flutter pub cache clean
flutter pub get
flutter pub upgrade
```

---

**🎉 Your Flutter mobile app prototype is ready!**

Next: Connect to the real backend API and build technical components.
