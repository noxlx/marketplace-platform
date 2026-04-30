import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/auth_user.dart';
import '../models/category.dart';
import '../models/listing.dart';
import '../models/notification_item.dart';

class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.refreshToken,
    required this.user,
  });

  final String accessToken;
  final String refreshToken;
  final AuthUser user;
}

class ApiClient {
  ApiClient({
    this.baseUrl = const String.fromEnvironment(
      'API_URL',
      defaultValue: 'http://10.0.2.2:3000',
    ),
    http.Client? httpClient,
  }) : _httpClient = httpClient ?? http.Client();

  final String baseUrl;
  final http.Client _httpClient;

  Uri _uri(String path, [Map<String, String?> query = const {}]) {
    final uri = Uri.parse('$baseUrl$path');
    return uri.replace(
      queryParameters: {
        for (final entry in query.entries)
          if (entry.value != null && entry.value!.isNotEmpty) entry.key: entry.value!,
      },
    );
  }

  Map<String, String> _headers([String? token]) {
    return {
      'Content-Type': 'application/json',
      if (token != null && token.isNotEmpty) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<Listing>> searchListings({
    String query = '',
    String city = '',
    String category = '',
  }) async {
    final response = await _httpClient.get(
      _uri('/api/v1/search', {
        'q': query,
        'city': city,
        'category': category,
        'pageSize': '30',
      }),
      headers: _headers(),
    );

    final body = _decode(response);
    final results = body['results'] as List<dynamic>? ?? const [];
    return results.map((item) => Listing.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<List<Category>> getCategories() async {
    final response = await _httpClient.get(_uri('/api/v1/categories'), headers: _headers());
    final body = _decode(response);
    final data = body is List<dynamic> ? body : body['data'] as List<dynamic>? ?? const [];
    return data.map((item) => Category.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<void> sendOtp(String phoneNumber) async {
    final response = await _httpClient.post(
      _uri('/api/v1/auth/send-otp'),
      headers: _headers(),
      body: jsonEncode({'phoneNumber': phoneNumber}),
    );
    _decode(response);
  }

  Future<AuthSession> verifyOtp(String phoneNumber, String otp) async {
    final response = await _httpClient.post(
      _uri('/api/v1/auth/verify-otp'),
      headers: _headers(),
      body: jsonEncode({'phoneNumber': phoneNumber, 'otp': otp}),
    );
    final body = _decode(response);
    return AuthSession(
      accessToken: body['accessToken']?.toString() ?? '',
      refreshToken: body['refreshToken']?.toString() ?? '',
      user: AuthUser.fromJson(body['user'] as Map<String, dynamic>),
    );
  }

  Future<void> createListing(String token, Map<String, dynamic> payload) async {
    final response = await _httpClient.post(
      _uri('/api/v1/listings'),
      headers: _headers(token),
      body: jsonEncode(payload),
    );
    _decode(response);
  }

  Future<void> favoriteListing(String token, String listingId) async {
    final response = await _httpClient.post(
      _uri('/api/v1/favorites/$listingId'),
      headers: _headers(token),
    );
    _decode(response);
  }

  Future<List<NotificationItem>> getNotifications(String token) async {
    final response = await _httpClient.get(
      _uri('/api/v1/notifications/me'),
      headers: _headers(token),
    );
    final body = _decode(response);
    final data = body['data'] as List<dynamic>? ?? const [];
    return data.map((item) => NotificationItem.fromJson(item as Map<String, dynamic>)).toList();
  }

  Future<Map<String, dynamic>> getAdminStats(String token) async {
    final response = await _httpClient.get(
      _uri('/api/v1/admin/stats'),
      headers: _headers(token),
    );
    return _decode(response);
  }

  dynamic _decode(http.Response response) {
    final body = response.body.isEmpty ? <String, dynamic>{} : jsonDecode(response.body);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw ApiException(body.toString(), response.statusCode);
    }
    return body;
  }
}

class ApiException implements Exception {
  const ApiException(this.message, this.statusCode);

  final String message;
  final int statusCode;

  @override
  String toString() => 'ApiException($statusCode): $message';
}
