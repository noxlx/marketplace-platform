import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../models/listing.dart';
import '../providers/marketplace_provider.dart';
import '../widgets/listing_card.dart';

class BrowseScreen extends StatefulWidget {
  const BrowseScreen({super.key});

  @override
  State<BrowseScreen> createState() => _BrowseScreenState();
}

class _BrowseScreenState extends State<BrowseScreen> {
  final _searchController = TextEditingController();
  String _selectedCategory = 'All';
  String _selectedCity = 'All';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MarketplaceProvider>().loadMarketplace();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showFiltersSheet() {
    showModalBottomSheet<void>(
      context: context,
      builder: (_) => Container(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Filters', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            const Text('Category', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Consumer<MarketplaceProvider>(
              builder: (_, marketplace, __) => Wrap(
                spacing: 8,
                children: [
                  _buildFilterChip('All', _selectedCategory == 'All', () {
                    setState(() => _selectedCategory = 'All');
                  }),
                  ...marketplace.categories.map((cat) =>
                    _buildFilterChip(cat.name, _selectedCategory == cat.name, () {
                      setState(() => _selectedCategory = cat.name);
                    })
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text('City', style: TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                _buildFilterChip('All', _selectedCity == 'All', () {
                  setState(() => _selectedCity = 'All');
                }),
                ...[
                  'Baghdad', 'Erbil', 'Basra', 'Mosul', 'Najaf', 'Karbala'
                ].map((city) =>
                  _buildFilterChip(city, _selectedCity == city, () {
                    setState(() => _selectedCity = city);
                  })
                ),
              ],
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  _applyFilters();
                },
                child: const Text('Apply Filters'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool selected, VoidCallback onTap) {
    return FilterChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => onTap(),
      backgroundColor: Colors.grey[200],
      selectedColor: const Color(0xFF0F766E),
      labelStyle: TextStyle(
        color: selected ? Colors.white : Colors.black87,
      ),
    );
  }

  Future<void> _applyFilters() async {
    final marketplace = context.read<MarketplaceProvider>();
    final query = _searchController.text.trim();
    final categoryFilter = _selectedCategory == 'All' ? '' : _selectedCategory;
    final cityFilter = _selectedCity == 'All' ? '' : _selectedCity;

    await marketplace.loadMarketplace(
      query: query,
      city: cityFilter,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Browse Listings'),
        elevation: 0,
      ),
      body: Consumer<MarketplaceProvider>(
        builder: (context, marketplace, _) => Column(
          children: [
            // Search and Filter Bar
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search listings...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                    onChanged: (_) => _applyFilters(),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: _selectedCategory,
                            underline: const SizedBox(),
                            items: ['All', ...marketplace.categories.map((c) => c.name)]
                              .map((cat) => DropdownMenuItem(
                                value: cat,
                                child: Text(cat),
                              ))
                              .toList(),
                            onChanged: (value) {
                              if (value != null) {
                                setState(() => _selectedCategory = value);
                                _applyFilters();
                              }
                            },
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.grey[300]!),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButton<String>(
                            isExpanded: true,
                            value: _selectedCity,
                            underline: const SizedBox(),
                            items: ['All', 'Baghdad', 'Erbil', 'Basra', 'Mosul', 'Najaf', 'Karbala']
                              .map((city) => DropdownMenuItem(
                                value: city,
                                child: Text(city),
                              ))
                              .toList(),
                            onChanged: (value) {
                              if (value != null) {
                                setState(() => _selectedCity = value);
                                _applyFilters();
                              }
                            },
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: _showFiltersSheet,
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey[300]!),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.tune),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Listings Grid
            Expanded(
              child: marketplace.listings.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.inbox, size: 64, color: Colors.grey[400]),
                        const SizedBox(height: 16),
                        Text(
                          'No listings found',
                          style: TextStyle(color: Colors.grey[600], fontSize: 16),
                        ),
                      ],
                    ),
                  )
                : GridView.builder(
                    padding: const EdgeInsets.all(12),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.75,
                      mainAxisSpacing: 12,
                      crossAxisSpacing: 12,
                    ),
                    itemCount: marketplace.listings.length,
                    itemBuilder: (context, index) {
                      final listing = marketplace.listings[index];
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
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
