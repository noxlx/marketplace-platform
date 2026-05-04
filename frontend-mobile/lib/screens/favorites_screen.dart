import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/listing.dart';
import '../providers/auth_provider.dart';
import '../providers/marketplace_provider.dart';
import '../widgets/listing_card.dart';
import '../widgets/auth_sheet.dart';
import '../services/api_client.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  // Mock favorites data
  final List<Listing> _favorites = [
    Listing(
      id: 'fav1',
      title: 'iPhone 13 Pro - Excellent Condition',
      description: 'Barely used, all accessories included',
      price: 450000,
      city: 'Baghdad',
      categoryId: 'phones',
      categoryName: 'Phones',
      status: 'active',
      views: 245,
      favoritesCount: 12,
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
      userName: 'Tech Store Baghdad',
      userRating: 4.8,
    ),
    Listing(
      id: 'fav2',
      title: 'Mercedes-Benz C300 - 2015',
      description: 'Well maintained, full service history',
      price: 25000000,
      city: 'Baghdad',
      categoryId: 'cars',
      categoryName: 'Cars',
      status: 'active',
      views: 523,
      favoritesCount: 34,
      createdAt: DateTime.now().subtract(const Duration(days: 15)),
      userName: 'Luxury Cars',
      userRating: 4.9,
    ),
    Listing(
      id: 'fav3',
      title: 'Modern Apartment - Mansour District',
      description: '2 bedrooms, fully furnished, new building',
      price: 850000000,
      city: 'Baghdad',
      categoryId: 'real-estate',
      categoryName: 'Real Estate',
      status: 'active',
      views: 1230,
      favoritesCount: 89,
      createdAt: DateTime.now().subtract(const Duration(days: 20)),
      userName: 'Prime Properties',
      userRating: 4.7,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Listings'),
        elevation: 0,
      ),
      body: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          if (!auth.isAuthenticated) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_border, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 24),
                  const Text(
                    'Sign in to save listings',
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      showModalBottomSheet<void>(
                        context: context,
                        isScrollControlled: true,
                        builder: (_) => AuthSheet(
                          apiClient: context.read<ApiClient>(),
                          onVerified: (session) {
                            Navigator.pop(context);
                          },
                        ),
                      );
                    },
                    child: const Text('Sign In'),
                  ),
                ],
              ),
            );
          }

          if (_favorites.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_border, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 24),
                  const Text(
                    'No saved listings yet',
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Start saving your favorite listings',
                    style: TextStyle(color: Colors.grey[600]),
                  ),
                ],
              ),
            );
          }

          return GridView.builder(
            padding: const EdgeInsets.all(12),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.75,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
            ),
            itemCount: _favorites.length,
            itemBuilder: (context, index) {
              final listing = _favorites[index];
              return GestureDetector(
                onTap: () {
                  Navigator.pushNamed(
                    context,
                    '/listing-detail',
                    arguments: listing,
                  );
                },
                child: ListingCard(listing: listing),
              );
            },
          );
        },
      ),
    );
  }
}
