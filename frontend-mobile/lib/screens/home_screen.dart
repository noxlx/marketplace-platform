import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/auth_user.dart';
import '../models/category.dart';
import '../models/listing.dart';
import '../models/notification_item.dart';
import '../providers/auth_provider.dart';
import '../providers/marketplace_provider.dart';
import '../services/api_client.dart';
import '../widgets/auth_sheet.dart';
import '../widgets/create_listing_sheet.dart';
import '../widgets/listing_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _searchController = TextEditingController();
  final _cityController = TextEditingController();
  final _pageController = PageController();

  int _tabIndex = 0;

  @override
  void initState() {
    super.initState();
    // Load marketplace data when screen initializes
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MarketplaceProvider>().loadMarketplace();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _cityController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  void _openAuthSheet() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => AuthSheet(
        apiClient: context.read<ApiClient>(),
        onVerified: (session) {
          // Auth state is automatically updated by AuthProvider
          _loadNotifications();
        },
      ),
    );
  }

  void _openCreateListingSheet() {
    final auth = context.read<AuthProvider>();
    if (!auth.isAuthenticated) {
      _showSnack('Sign in before creating a listing.');
      return;
    }

    final marketplace = context.read<MarketplaceProvider>();
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => CreateListingSheet(
        apiClient: context.read<ApiClient>(),
        token: auth.accessToken,
        categories: marketplace.categories,
        onCreated: () {
          _showSnack('Listing created.');
          marketplace.loadMarketplace();
        },
      ),
    );
  }

  Future<void> _favoriteListing(String listingId) async {
    final auth = context.read<AuthProvider>();
    if (!auth.isAuthenticated) {
      _showSnack('Sign in first to save listings.');
      return;
    }

    try {
      await context.read<MarketplaceProvider>().favoriteListing(auth.accessToken, listingId);
      _showSnack('Listing saved.');
    } catch (error) {
      _showSnack(error.toString());
    }
  }

  Future<void> _loadMarketplace() async {
    await context.read<MarketplaceProvider>().loadMarketplace(
          query: _searchController.text.trim(),
          city: _cityController.text.trim(),
        );
  }

  void _loadNotifications() {
    final auth = context.read<AuthProvider>();
    if (auth.isAuthenticated) {
      context.read<MarketplaceProvider>().loadNotifications(auth.accessToken);
    }
  }

  Future<void> _loadAdminStats() async {
    final auth = context.read<AuthProvider>();
    if (!auth.isAuthenticated) {
      _showSnack('Sign in with an admin account.');
      return;
    }

    try {
      await context.read<MarketplaceProvider>().loadAdminStats(auth.accessToken);
    } catch (error) {
      _showSnack(error.toString());
    }
  }

  void _showSnack(String message) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  void _setTab(int index) {
    setState(() => _tabIndex = index);
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 240),
      curve: Curves.easeOut,
    );

    if (index == 1) _loadNotifications();
    if (index == 2) _loadAdminStats();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        return Scaffold(
          appBar: AppBar(
            title: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Iraqi Marketplace'),
                Consumer<MarketplaceProvider>(
                  builder: (context, marketplace, _) {
                    return Text(
                      marketplace.demoMode ? 'Demo data mode' : 'Live API connected',
                      style: Theme.of(context).textTheme.labelMedium?.copyWith(
                            color: const Color(0xFF667085),
                          ),
                    );
                  },
                ),
              ],
            ),
            actions: [
              IconButton(
                tooltip: auth.isAuthenticated ? auth.user?.displayName ?? 'Account' : 'Sign in',
                onPressed: auth.isAuthenticated
                    ? () {
                        showModalBottomSheet<void>(
                          context: context,
                          builder: (_) => Center(
                            child: Padding(
                              padding: const EdgeInsets.all(20),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'Account',
                                    style: Theme.of(context).textTheme.titleLarge,
                                  ),
                                  const SizedBox(height: 16),
                                  Text('Phone: ${auth.user?.phoneNumber}'),
                                  Text('Name: ${auth.user?.displayName}'),
                                  const SizedBox(height: 20),
                                  FilledButton.tonal(
                                    onPressed: () {
                                      auth.signOut();
                                      context.read<MarketplaceProvider>().clearData();
                                      Navigator.pop(context);
                                      _showSnack('Signed out');
                                    },
                                    child: const Text('Sign out'),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }
                    : _openAuthSheet,
                icon: Icon(auth.isAuthenticated ? Icons.account_circle : Icons.login),
              ),
            ],
          ),
          body: PageView(
            controller: _pageController,
            onPageChanged: (index) => setState(() => _tabIndex = index),
            children: [
              _buildBrowseTab(),
              _buildNotificationsTab(),
              _buildAdminTab(),
            ],
          ),
          floatingActionButton: _tabIndex == 0
              ? FloatingActionButton.extended(
                  onPressed: _openCreateListingSheet,
                  icon: const Icon(Icons.add),
                  label: const Text('Sell'),
                )
              : null,
          bottomNavigationBar: NavigationBar(
            selectedIndex: _tabIndex,
            onDestinationSelected: _setTab,
            destinations: const [
              NavigationDestination(icon: Icon(Icons.search), label: 'Browse'),
              NavigationDestination(icon: Icon(Icons.notifications_none), label: 'Alerts'),
              NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: 'Admin'),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBrowseTab() {
    return Consumer<MarketplaceProvider>(
      builder: (context, marketplace, _) {
        final filtered = marketplace.filterListings(
          query: _searchController.text.trim(),
          city: _cityController.text.trim(),
          category: '',
        );

        return RefreshIndicator(
          onRefresh: _loadMarketplace,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
            children: [
              _buildSearchBox(),
              const SizedBox(height: 12),
              _buildCategories(),
              const SizedBox(height: 14),
              if (marketplace.loading)
                const Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: CircularProgressIndicator()),
                )
              else
                ...filtered.map(
                  (listing) => ListingCard(
                    listing: listing,
                    onFavorite: () => _favoriteListing(listing.id),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSearchBox() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              textInputAction: TextInputAction.search,
              onSubmitted: (_) => _loadMarketplace(),
              decoration: const InputDecoration(
                labelText: 'Search',
                prefixIcon: Icon(Icons.search),
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: _cityController,
              textInputAction: TextInputAction.search,
              onSubmitted: (_) => _loadMarketplace(),
              decoration: const InputDecoration(
                labelText: 'City',
                prefixIcon: Icon(Icons.location_city_outlined),
              ),
            ),
            const SizedBox(height: 10),
            SizedBox(
              width: double.infinity,
              child: FilledButton.icon(
                onPressed: _loadMarketplace,
                icon: const Icon(Icons.tune),
                label: const Text('Search listings'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategories() {
    return Consumer<MarketplaceProvider>(
      builder: (context, marketplace, _) {
        return SizedBox(
          height: 46,
          child: ListView(
            scrollDirection: Axis.horizontal,
            children: [
              Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: const Text('All'),
                  selected: true,
                  onSelected: (_) => _loadMarketplace(),
                ),
              ),
              for (final category in marketplace.categories)
                Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(category.name),
                    selected: false,
                    onSelected: (_) => _loadMarketplace(),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotificationsTab() {
    return Consumer<MarketplaceProvider>(
      builder: (context, marketplace, _) {
        return Consumer<AuthProvider>(
          builder: (context, auth, _) {
            return RefreshIndicator(
              onRefresh: () async {
                if (auth.isAuthenticated) {
                  await marketplace.loadNotifications(auth.accessToken);
                }
              },
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  Text(
                    'Notifications',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.w900,
                        ),
                  ),
                  const SizedBox(height: 12),
                  if (!auth.isAuthenticated)
                    const _EmptyState(message: 'Sign in to load notifications and chat alerts.')
                  else if (marketplace.notifications.isEmpty)
                    const _EmptyState(message: 'No notifications yet.')
                  else
                    ...marketplace.notifications.map(
                      (item) => Card(
                        child: ListTile(
                          leading: Icon(item.isRead ? Icons.notifications_none : Icons.notifications_active),
                          title: Text(item.title),
                          subtitle: Text(item.message),
                          trailing: Text(item.type),
                        ),
                      ),
                    ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildAdminTab() {
    const keys = ['users', 'activeUsers', 'listings', 'activeListings', 'pendingReports', 'conversations'];

    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        return Consumer<MarketplaceProvider>(
          builder: (context, marketplace, _) {
            return ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Admin overview',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.w900,
                            ),
                      ),
                    ),
                    IconButton.filledTonal(
                      onPressed: _loadAdminStats,
                      icon: const Icon(Icons.refresh),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                if (!auth.isAuthenticated)
                  const _EmptyState(message: 'Sign in with an admin account to load stats.')
                else if (marketplace.adminStats == null)
                  const _EmptyState(message: 'Admin stats are not loaded yet.')
                else
                  GridView.count(
                    crossAxisCount: 2,
                    childAspectRatio: 1.35,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 12,
                    crossAxisSpacing: 12,
                    children: [
                      for (final key in keys)
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Text(_labelFor(key)),
                                const SizedBox(height: 8),
                                Text(
                                  '${marketplace.adminStats![key] ?? '-'}',
                                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                        fontWeight: FontWeight.w900,
                                      ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
              ],
            );
          },
        );
      },
    );
  }

  String _labelFor(String key) {
    return key.replaceAllMapped(RegExp(r'([A-Z])'), (match) => ' ${match.group(1)}').toLowerCase();
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Text(
          message,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: const Color(0xFF667085),
              ),
        ),
      ),
    );
  }
}

  Widget _buildCategories() {
    return SizedBox(
      height: 46,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: [
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: const Text('All'),
              selected: _selectedCategory.isEmpty,
              onSelected: (_) {
                setState(() => _selectedCategory = '');
                _loadMarketplace();
              },
            ),
          ),
          for (final category in _categories)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: ChoiceChip(
                label: Text(category.name),
                selected: _selectedCategory == category.id,
                onSelected: (_) {
                  setState(() => _selectedCategory = category.id);
                  _loadMarketplace();
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildNotificationsTab() {
    return RefreshIndicator(
      onRefresh: _loadNotifications,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Notifications',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w900,
                ),
          ),
          const SizedBox(height: 12),
          if (_token.isEmpty)
            const _EmptyState(message: 'Sign in to load notifications and chat alerts.')
          else if (_notifications.isEmpty)
            const _EmptyState(message: 'No notifications yet.')
          else
            ..._notifications.map(
              (item) => Card(
                child: ListTile(
                  leading: Icon(item.isRead ? Icons.notifications_none : Icons.notifications_active),
                  title: Text(item.title),
                  subtitle: Text(item.message),
                  trailing: Text(item.type),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildAdminTab() {
    final keys = ['users', 'activeUsers', 'listings', 'activeListings', 'pendingReports', 'conversations'];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Admin overview',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
              ),
            ),
            IconButton.filledTonal(
              onPressed: _loadAdminStats,
              icon: const Icon(Icons.refresh),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (_token.isEmpty)
          const _EmptyState(message: 'Sign in with an admin account to load stats.')
        else if (_adminStats == null)
          const _EmptyState(message: 'Admin stats are not loaded yet.')
        else
          GridView.count(
            crossAxisCount: 2,
            childAspectRatio: 1.35,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: [
              for (final key in keys)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        Text(_labelFor(key)),
                        const SizedBox(height: 8),
                        Text(
                          '${_adminStats![key] ?? '-'}',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.w900,
                              ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),
      ],
    );
  }

  String _labelFor(String key) {
    return key.replaceAllMapped(RegExp(r'([A-Z])'), (match) => ' ${match.group(1)}').toLowerCase();
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Text(
          message,
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: const Color(0xFF667085),
              ),
        ),
      ),
    );
  }
}

const _fallbackCategories = [
  Category(id: 'cars', name: 'Cars', slug: 'cars', sortOrder: 1, isActive: true),
  Category(id: 'real-estate', name: 'Real Estate', slug: 'real-estate', sortOrder: 2, isActive: true),
  Category(id: 'electronics', name: 'Electronics', slug: 'electronics', sortOrder: 3, isActive: true),
  Category(id: 'furniture', name: 'Furniture', slug: 'furniture', sortOrder: 4, isActive: true),
];

final _fallbackListings = [
  Listing(
    id: 'demo-1',
    title: 'Toyota Land Cruiser GXR 2021',
    description: 'Clean title, full service history, leather interior, ready for inspection.',
    price: 58500,
    city: 'Baghdad',
    categoryId: 'cars',
    categoryName: 'Cars',
    status: 'active',
    views: 1240,
    favoritesCount: 86,
    isFeatured: true,
    isTop: true,
    userName: 'Karrar Motors',
    userRating: 4.8,
    primaryImage: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80',
    createdAt: DateTime.now(),
  ),
  Listing(
    id: 'demo-2',
    title: 'Modern family house near Erbil Citadel',
    description: 'Three bedrooms, private garden, parking, and a bright open living space.',
    price: 185000,
    city: 'Erbil',
    categoryId: 'real-estate',
    categoryName: 'Real Estate',
    status: 'active',
    views: 856,
    favoritesCount: 44,
    isFeatured: true,
    userName: 'Darin Properties',
    userRating: 4.6,
    primaryImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    createdAt: DateTime.now(),
  ),
  Listing(
    id: 'demo-3',
    title: 'iPhone 15 Pro Max 256GB',
    description: 'Natural titanium, battery health 99%, box and original cable included.',
    price: 1025,
    city: 'Basra',
    categoryId: 'electronics',
    categoryName: 'Electronics',
    status: 'active',
    views: 2340,
    favoritesCount: 132,
    isTop: true,
    userName: 'Basra Tech',
    userRating: 4.9,
    primaryImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80',
    createdAt: DateTime.now(),
  ),
];
