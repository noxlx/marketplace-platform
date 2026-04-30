class AuthUser {
  const AuthUser({
    required this.id,
    required this.phoneNumber,
    required this.firstName,
    required this.lastName,
    required this.city,
    required this.isVerified,
    required this.rating,
  });

  final String id;
  final String phoneNumber;
  final String firstName;
  final String lastName;
  final String city;
  final bool isVerified;
  final double rating;

  String get displayName => '$firstName $lastName';

  factory AuthUser.fromJson(Map<String, dynamic> json) {
    return AuthUser(
      id: json['id']?.toString() ?? '',
      phoneNumber: json['phoneNumber']?.toString() ?? '',
      firstName: json['firstName']?.toString() ?? '',
      lastName: json['lastName']?.toString() ?? '',
      city: json['city']?.toString() ?? '',
      isVerified: json['isVerified'] == true,
      rating: double.tryParse(json['rating']?.toString() ?? '0') ?? 0,
    );
  }
}
