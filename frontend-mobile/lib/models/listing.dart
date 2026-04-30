class Listing {
  const Listing({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.city,
    required this.categoryId,
    required this.status,
    required this.views,
    required this.favoritesCount,
    required this.createdAt,
    this.categoryName,
    this.location,
    this.primaryImage,
    this.userName,
    this.userRating,
    this.isFeatured = false,
    this.isTop = false,
  });

  final String id;
  final String title;
  final String description;
  final double price;
  final String city;
  final String categoryId;
  final String? categoryName;
  final String? location;
  final String status;
  final int views;
  final int favoritesCount;
  final bool isFeatured;
  final bool isTop;
  final String? primaryImage;
  final String? userName;
  final double? userRating;
  final DateTime createdAt;

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      price: double.tryParse(json['price']?.toString() ?? '0') ?? 0,
      city: json['city']?.toString() ?? '',
      categoryId: json['categoryId']?.toString() ?? '',
      categoryName: json['categoryName']?.toString(),
      location: json['location']?.toString(),
      status: json['status']?.toString() ?? 'active',
      views: int.tryParse(json['views']?.toString() ?? '0') ?? 0,
      favoritesCount: int.tryParse(json['favoritesCount']?.toString() ?? '0') ?? 0,
      isFeatured: json['isFeatured'] == true,
      isTop: json['isTop'] == true,
      primaryImage: json['primaryImage']?.toString(),
      userName: json['userName']?.toString(),
      userRating: double.tryParse(json['userRating']?.toString() ?? ''),
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? '') ?? DateTime.now(),
    );
  }
}
