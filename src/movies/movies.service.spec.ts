import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoviesService } from './movies.service';

describe('MovieService', () => {
  let movieService: MoviesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService, PrismaService],
    }).compile();

    movieService = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('findWithPagination', () => {
    it('should return movies with pagination', async () => {
      const mockMovies = [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
      ];
      const mockTotalMovies = 2;
      const prismaMovieFindManyMock = jest
        .spyOn(prismaService.movie, 'findMany')
        .mockResolvedValue(mockMovies as any);
      const prismaMovieCountMock = jest
        .spyOn(prismaService.movie, 'count')
        .mockResolvedValue(mockTotalMovies);

      const result = await movieService.findWithPagination('', 10);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Movies fetched successfully');
      expect(result.data).toEqual(mockMovies);
      expect(result.total).toBe(mockTotalMovies);

      expect(prismaMovieFindManyMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        cursor: undefined,
      });
      expect(prismaMovieCountMock).toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      const prismaMovieFindManyMock = jest
        .spyOn(prismaService.movie, 'findMany')
        .mockRejectedValue(new Error('An error occurred'));

      const result = await movieService.findWithPagination('', 10);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Something went wrong...');

      expect(prismaMovieFindManyMock).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        cursor: undefined,
      });
    });
  });
});
