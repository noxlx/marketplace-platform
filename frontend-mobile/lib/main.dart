import 'package:flutter/material.dart';

import 'screens/home_screen.dart';

void main() {
  runApp(const MarketplaceMobileApp());
}

class MarketplaceMobileApp extends StatelessWidget {
  const MarketplaceMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    final colorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF0F766E),
      brightness: Brightness.light,
    );

    return MaterialApp(
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
        cardTheme: CardTheme(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: Color(0xFFD7DDE5)),
          ),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
