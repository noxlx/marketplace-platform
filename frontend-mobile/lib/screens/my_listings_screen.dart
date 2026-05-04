import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/listing.dart';
import '../providers/auth_provider.dart';
import '../providers/marketplace_provider.dart';
import '../widgets/auth_sheet.dart';
import '../services/api_client.dart';

class MyListingsScreen extends StatefulWidget {
  const MyListingsScreen({super.key});

  @override
  State<MyListingsScreen> createState() => _MyListingsScreenState();
}

class _MyListingsScreenState extends State<MyListingsScreen> {
  int _selectedFilter = 0;

  // Mock my listings data
  final List<Listing> _myListings = [
    Listing(
      id: 'my1',
      title: 'Dell Laptop - Like New',
      description: 'Intel i7, 16GB RAM, 512GB SSD',
      price: 350000,
      city: 'Baghdad',
      categoryId: 'computers',
      categoryName: 'Computers',
      status: 'active',
      views: 123,
      favoritesCount: 8,
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
      userName: 'Me',
      userRating: 4.6,
    ),
    Listing(
      id: 'my2',
      title: 'Sofa - Brown Leather',
      description: 'Very comfortable, perfect condition',
      price: 800000,
      city: 'Baghdad',
      categoryId: 'furniture',
      categoryName: 'Furniture',
      status: 'active',
      views: 45,
      favoritesCount: 2,
      createdAt: DateTime.now().subtract(const Duration(days: 7)),
      userName: 'Me',
      userRating: 4.6,
    ),
    Listing(
      id: 'my3',
      title: 'Mountain Bike - Trek X-Caliber',
      description: 'Barely used, all original parts',
      price: 1200000,
      city: 'Erbil',
      categoryId: 'sports',
      categoryName: 'Sports',
      status: 'sold',
      views: 234,
      favoritesCount: 15,
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
      userName: 'Me',
      userRating: 4.6,
    ),
  ];

  List<Listing> get _filteredListings {
    switch (_selectedFilter) {
      case 0: // All
        return _myListings;
      case 1: // Active
        return _myListings.where((l) => l.status == 'active').toList();
      case 2: // Sold
        return _myListings.where((l) => l.status == 'sold').toList();
      case 3: // Archived
        return _myListings.where((l) => l.status == 'archived').toList();
      default:
        return _myListings;
    }
  }

  void _showListingOptions(Listing listing) {
    showModalBottomSheet<void>(
      context: context,
      builder: (_) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.edit),
              title: const Text('Edit Listing'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Edit listing coming soon')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.visibility),
              title: const Text('View Listing'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(
                  context,
                  '/listing-detail',
                  arguments: listing,
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.bar_chart),
              title: const Text('Statistics'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Statistics coming soon')),
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.refresh),
              title: const Text('Renew Listing'),
              onTap: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Listing renewed')),
                );
              },
            ),
            if (listing.status == 'active')
              ListTile(
                leading: const Icon(Icons.archive),
                title: const Text('Archive Listing'),
                onTap: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Listing archived')),
                  );
                },
              )
            else
              ListTile(
                leading: const Icon(Icons.delete, color: Colors.red),
                title: const Text('Delete Listing', style: TextStyle(color: Colors.red)),
                onTap: () {
                  Navigator.pop(context);
                  showDialog(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Delete Listing?'),
                      content: const Text('This action cannot be undone.'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Listing deleted')),
                            );
                          },
                          child: const Text('Delete', style: TextStyle(color: Colors.red)),
                        ),
                      ],
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Listings'),
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Create new listing')),
              );
            },
          ),
        ],
      ),
      body: Consumer<AuthProvider>(
        builder: (context, auth, _) {
          if (!auth.isAuthenticated) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.list, size: 80, color: Colors.grey[400]),
                  const SizedBox(height: 24),
                  const Text(
                    'Sign in to see your listings',
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

          return Column(
            children: [
              // Filter Tabs
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    _buildFilterButton('All', 0),
                    const SizedBox(width: 8),
                    _buildFilterButton('Active', 1),
                    const SizedBox(width: 8),
                    _buildFilterButton('Sold', 2),
                    const SizedBox(width: 8),
                    _buildFilterButton('Archived', 3),
                  ],
                ),
              ),
              // Listings
              Expanded(
                child: _filteredListings.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.inbox, size: 64, color: Colors.grey[400]),
                          const SizedBox(height: 16),
                          const Text('No listings in this category'),
                        ],
                      ),
                    )
                  : ListView.separated(
                      padding: const EdgeInsets.all(12),
                      itemCount: _filteredListings.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final listing = _filteredListings[index];
                        return Container(
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[200]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: ListTile(
                            leading: Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                color: Colors.grey[300],
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: listing.primaryImage != null
                                ? Image.network(
                                    listing.primaryImage!,
                                    fit: BoxFit.cover,
                                  )
                                : const Icon(Icons.image),
                            ),
                            title: Text(listing.title),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const SizedBox(height: 4),
                                Text(
                                  '${listing.price.toStringAsFixed(0)} IQD',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: Color(0xFF0F766E),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.visibility,
                                      size: 12,
                                      color: Colors.grey[600],
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      '${listing.views} views',
                                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                                    ),
                                    const SizedBox(width: 16),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: listing.status == 'active'
                                          ? Colors.green[100]
                                          : listing.status == 'sold'
                                            ? Colors.blue[100]
                                            : Colors.grey[200],
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        listing.status.toUpperCase(),
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w600,
                                          color: listing.status == 'active'
                                            ? Colors.green[700]
                                            : listing.status == 'sold'
                                              ? Colors.blue[700]
                                              : Colors.grey[700],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            trailing: PopupMenuButton(
                              itemBuilder: (context) => [
                                const PopupMenuItem(
                                  child: Row(
                                    children: [
                                      Icon(Icons.edit, size: 16),
                                      SizedBox(width: 8),
                                      Text('Edit'),
                                    ],
                                  ),
                                ),
                                const PopupMenuItem(
                                  child: Row(
                                    children: [
                                      Icon(Icons.bar_chart, size: 16),
                                      SizedBox(width: 8),
                                      Text('Stats'),
                                    ],
                                  ),
                                ),
                              ],
                              onSelected: (value) {
                                _showListingOptions(listing);
                              },
                            ),
                            onTap: () {
                              Navigator.pushNamed(
                                context,
                                '/listing-detail',
                                arguments: listing,
                              );
                            },
                          ),
                        );
                      },
                    ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildFilterButton(String label, int index) {
    final isSelected = _selectedFilter == index;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (_) {
        setState(() => _selectedFilter = index);
      },
      backgroundColor: Colors.grey[200],
      selectedColor: const Color(0xFF0F766E),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black87,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}
