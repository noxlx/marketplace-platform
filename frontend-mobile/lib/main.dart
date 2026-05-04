import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'models/listing.dart';
import 'providers/auth_provider.dart';
import 'providers/marketplace_provider.dart';
import 'screens/browse_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/favorites_screen.dart';
import 'screens/listing_detail_screen.dart';
import 'screens/main_navigation_screen.dart';
import 'screens/my_listings_screen.dart';
import 'screens/profile_screen.dart';
import 'services/api_client.dart';

void main() {
  runApp(const MarketplaceMobileApp());
}

class MarketplaceMobileApp extends StatelessWidget {
  const MarketplaceMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    final apiClient = ApiClient();

    final colorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF0F766E),
      brightness: Brightness.light,
    );

    return MultiProvider(
      providers: [
        Provider<ApiClient>.value(value: apiClient),
        ChangeNotifierProvider(
          create: (_) => AuthProvider(apiClient: apiClient),
        ),
        ChangeNotifierProvider(
          create: (_) => MarketplaceProvider(apiClient: apiClient),
        ),
      ],
      child: MaterialApp(
        title: 'Iraqi Marketplace',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: colorScheme,
          useMaterial3: true,
          scaffoldBackgroundColor: const Color(0xFFF7F8FA),
          appBarTheme: const AppBarTheme(
            centerTitle: false,
            backgroundColor: Color(0xFFF7F8FA),
            foregroundColor: Color(0xFF1F2933),
            elevation: 0,
          ),
          cardTheme: CardThemeData(
            elevation: 0,
            color: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(8),
              side: const BorderSide(color: Color(0xFFD7DDE5)),
            ),
          ),
        ),
        home: const MainNavigationScreen(),
        onGenerateRoute: (settings) {
          switch (settings.name) {
            case '/listing-detail':
              final listing = settings.arguments as Listing;
              return MaterialPageRoute(
                builder: (context) => ListingDetailScreen(listing: listing),
              );
            case '/chat':
              final listingId = settings.arguments as String?;
              return MaterialPageRoute(
                builder: (context) => const ChatScreen(),
              );
            case '/chat-detail':
              final conversation = settings.arguments as ChatConversation;
              return MaterialPageRoute(
                builder: (context) => ChatDetailScreen(conversation: conversation),
              );
            default:
              return null;
          }
        },
      ),
    );
  }
}
