import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/auth_user.dart';
import '../services/api_client.dart';
import 'token_storage.dart';

/// Provider for managing authentication state
class AuthProvider extends ChangeNotifier {
  AuthProvider({required this.apiClient}) {
    _loadSavedToken();
  }

  final ApiClient apiClient;

  String _accessToken = '';
  String _refreshToken = '';
  AuthUser? _user;
  bool _loading = false;
  String? _error;

  // Getters
  String get accessToken => _accessToken;
  String get refreshToken => _refreshToken;
  AuthUser? get user => _user;
  bool get isAuthenticated => _accessToken.isNotEmpty && _user != null;
  bool get loading => _loading;
  String? get error => _error;

  /// Load saved token from storage
  Future<void> _loadSavedToken() async {
    _loading = true;
    try {
      final token = await TokenStorage.getAccessToken();
      if (token != null && token.isNotEmpty) {
        _accessToken = token;
        _refreshToken = (await TokenStorage.getRefreshToken()) ?? '';
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Send OTP to phone number
  Future<void> sendOtp(String phoneNumber) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      await apiClient.sendOtp(phoneNumber);
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Verify OTP and save authentication
  Future<void> verifyOtp(String phoneNumber, String otp) async {
    _loading = true;
    _error = null;
    notifyListeners();

    try {
      final session = await apiClient.verifyOtp(phoneNumber, otp);
      _accessToken = session.accessToken;
      _refreshToken = session.refreshToken;
      _user = session.user;

      // Save tokens to storage
      await TokenStorage.saveTokens(_accessToken, _refreshToken);

      _error = null;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// Sign out and clear authentication
  Future<void> signOut() async {
    _accessToken = '';
    _refreshToken = '';
    _user = null;
    _error = null;
    await TokenStorage.clearTokens();
    notifyListeners();
  }

  /// Update user profile
  void setUser(AuthUser user) {
    _user = user;
    notifyListeners();
  }

  /// Clear error message
  void clearError() {
    _error = null;
    notifyListeners();
  }
}
