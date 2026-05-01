import { FavoritesController } from './favorites.controller';

describe('FavoritesController', () => {
  const favoritesService = {
    findMine: jest.fn(),
    add: jest.fn(),
    status: jest.fn(),
    remove: jest.fn(),
  };
  let controller: FavoritesController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new FavoritesController(favoritesService as any);
  });

  it('supports GET /favorites as an alias for the current user favorites list', async () => {
    const response = { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
    favoritesService.findMine.mockResolvedValue(response);

    await expect(controller.findMineAlias('user-1', 1, 20)).resolves.toBe(response);
    expect(favoritesService.findMine).toHaveBeenCalledWith('user-1', 1, 20);
  });

  it('supports POST /favorites with a listingId body', async () => {
    const response = {
      id: 'favorite-1',
      userId: 'user-1',
      listingId: 'listing-1',
      createdAt: new Date(),
    };
    favoritesService.add.mockResolvedValue(response);

    await expect(
      controller.addFromBody('user-1', { listingId: 'listing-1' }),
    ).resolves.toBe(response);
    expect(favoritesService.add).toHaveBeenCalledWith('user-1', 'listing-1');
  });
});
