import 'package:flutter/material.dart';

import '../models/listing.dart';

class ListingCard extends StatelessWidget {
  const ListingCard({
    required this.listing,
    required this.onFavorite,
    super.key,
  });

  final Listing listing;
  final VoidCallback onFavorite;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      margin: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          AspectRatio(
            aspectRatio: 16 / 9,
            child: _ListingImage(imageUrl: listing.primaryImage),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: [
                    _Chip(label: listing.categoryName ?? listing.categoryId),
                    _Chip(label: listing.city),
                    if (listing.isTop) const _Chip(label: 'Top'),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  listing.title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                      ),
                ),
                const SizedBox(height: 6),
                Text(
                  listing.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: const Color(0xFF667085),
                      ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        '\$${listing.price.toStringAsFixed(0)}',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w900,
                            ),
                      ),
                    ),
                    IconButton.filledTonal(
                      onPressed: onFavorite,
                      icon: const Icon(Icons.favorite_border),
                    ),
                  ],
                ),
                Row(
                  children: [
                    Expanded(child: Text(listing.userName ?? 'Local seller')),
                    const Icon(Icons.star, size: 16, color: Color(0xFFB7791F)),
                    const SizedBox(width: 4),
                    Text((listing.userRating ?? 4.5).toStringAsFixed(1)),
                    const SizedBox(width: 12),
                    Text('${listing.favoritesCount} saved'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ListingImage extends StatelessWidget {
  const _ListingImage({required this.imageUrl});

  final String? imageUrl;

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.isEmpty) {
      return Container(
        color: const Color(0xFFEFF3F7),
        child: const Icon(Icons.storefront, size: 42),
      );
    }

    return Image.network(
      imageUrl!,
      fit: BoxFit.cover,
      errorBuilder: (_, __, ___) => Container(
        color: const Color(0xFFEFF3F7),
        child: const Icon(Icons.image_not_supported_outlined, size: 42),
      ),
    );
  }
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(color: const Color(0xFFD7DDE5)),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
        child: Text(label, style: Theme.of(context).textTheme.labelSmall),
      ),
    );
  }
}
