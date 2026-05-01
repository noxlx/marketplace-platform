import 'package:flutter/material.dart';

import '../models/category.dart';
import '../models/listing.dart';
import '../models/notification_item.dart';
import '../services/api_client.dart';
import 'demo_data.dart';

/// Provider for managing marketplace data (listings, categories, notifications)
class MarketplaceProvider extends ChangeNotifier {
  MarketplaceProvider({required this.apiClient});

  final ApiClient apiClient;

  List<Category> _categories = demoCategories;
  List<Listing> _listings = demoListings;
  List<NotificationItem> _notifications = [];
  Map<String, dynamic>? _adminStats;

  bool _loading = false;
  bool _demoMode = true;
  String? _error;

  // Getters
  List<Category> get categories => _categories;
  List<Listing> get listings => _listings;
  List<NotificationItem> get notifications => _notifications;
  Map<String, dynamic>? get adminStats => _adminStats;
  bool get loading => _loading;
  bool get demoMode => _demoMode;
  String? get error => _error;

  /// Load listings and categories from API
  Future<void> loadMarketplace({
    String query = '',
    String city = '',
    String category = '',
  }) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        apiClient.searchListings(query: query, city: city, category: category),
        apiClient.getCategories(),
      ]);

      final listings = results[0] as List<Listing>;
      final categories = results[1] as List<Category>;

      _listings = listings.isEmpty ? demoListings : listings;
      _categories = categories.isEmpty ? demoCategories : categories;
      _demoMode = listings.isEmpty;
      _error = null;
    } catch (e) {
      // Fall back to demo data
      _listings = demoListings;
      _categories = demoCategories;
      _demoMode = true;
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Filter listings with local search (used for demo data)
  List<Listing> filterListings({
    required String query,
    required String city,
    required String category,
  }) {
    return _listings.where((listing) {
      final matchesQuery = query.isEmpty ||
          '${listing.title} ${listing.description}'.toLowerCase().contains(query.toLowerCase());
      final matchesCity = city.isEmpty || listing.city.toLowerCase().contains(city.toLowerCase());
      final matchesCategory = category.isEmpty || listing.categoryId == category;
      return matchesQuery && matchesCity && matchesCategory;
    }).toList();
  }

  /// Load notifications for authenticated user
  Future<void> loadNotifications(String token) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _notifications = await apiClient.getNotifications(token);
      _error = null;
    } catch (e) {
      _notifications = [];
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Load admin statistics
  Future<void> loadAdminStats(String token) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      _adminStats = await apiClient.getAdminStats(token);
      _error = null;
    } catch (e) {
      _adminStats = null;
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Create a new listing
  Future<void> createListing(String token, Map<String, dynamic> payload) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      await apiClient.createListing(token, payload);
      // Reload marketplace after creating listing
      await loadMarketplace();
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Add listing to favorites
  Future<void> favoriteListing(String token, String listingId) async {
    try {
      await apiClient.favoriteListing(token, listingId);
      // Update the favorite count locally
      final index = _listings.indexWhere((l) => l.id == listingId);
      if (index >= 0) {
        final old = _listings[index];
        _listings[index] = Listing(
          id: old.id,
          title: old.title,
          description: old.description,
          price: old.price,
          city: old.city,
          categoryId: old.categoryId,
          status: old.status,
          views: old.views,
          favoritesCount: old.favoritesCount + 1,
          createdAt: old.createdAt,
          categoryName: old.categoryName,
          location: old.location,
          primaryImage: old.primaryImage,
          userName: old.userName,
          userRating: old.userRating,
          isFeatured: old.isFeatured,
          isTop: old.isTop,
        );
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      rethrow;
    }
  }

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Clear all data (on logout)
  void clearData() {
    _listings = demoListings;
    _categories = demoCategories;
    _notifications = [];
    _adminStats = null;
    _demoMode = true;
    _error = null;
    notifyListeners();
  }
}
