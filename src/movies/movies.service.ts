import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GET_MOVIES_QUERY, GET_MOVIE_QUERY } from './queris';
@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMovieDto: CreateMovieDto) {
    const { directors, studios, categories, tags, ...movieData } =
      createMovieDto;

    const movie = await this.prisma.movie.create({
      data: {
        ...movieData,
        directors: {
          connectOrCreate: directors.map((director) => ({
            where: { name: director },
            create: { name: director },
          })),
        },
        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
        studios: {
          connectOrCreate: studios.map((studio) => ({
            where: { name: studio },
            create: { name: studio },
          })),
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    return {
      message: 'ინფორმაცია წარმატებით დაემატა',
      statusCode: HttpStatus.CREATED,
      data: {
        id: movie.id,
      },
    };
  }

  async search(title: string) {
    const movies = await this.prisma.movie.findMany({
      where: {
        // visible: true,
        OR: [
          { title: { contains: title, mode: 'insensitive' } },
          { titleEn: { contains: title, mode: 'insensitive' } },
        ],
      },
      select: GET_MOVIES_QUERY,
    });

    return {
      success: true,
      message: 'Movies fetched successfully',
      data: movies,
    };
  }

  async findAll(
    page: number,
    take: number,
    title: string,
    type: string,
    sort: string,
    user: any,
  ) {
    page = Number(page) || 1;
    take = Number(take) || 10;

    const skip = (page - 1) * take;

    const where = {};

    if (title) {
      where['OR'] = [
        { title: { contains: title, mode: 'insensitive' } },
        { titleEn: { contains: title, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where['type'] = { contains: type, mode: 'insensitive' };
    }

    if (user?.role !== 'ADMIN') {
      where['visible'] = true;
    }

    const orderBy: any =
      sort === 'latest' ? { createdAt: 'desc' } : { latestEpisodeDate: 'desc' };

    const movies = await this.prisma.movie.findMany({
      skip,
      take,
      where,
      orderBy: orderBy,
      select: GET_MOVIES_QUERY,
    });

    const totalMovies = await this.prisma.movie.count({ where });

    movies.forEach((movie: any) => {
      if (movie.seasons && movie.seasons.length > 0) {
        const lastSeason = movie.seasons[movie.seasons.length - 1];
        movie.lastSeasonEpCount = lastSeason.episodes
          ? lastSeason.episodes.length
          : 0;
      } else {
        movie.lastSeasonEpCount = 0;
      }
      delete movie.seasons;
    });

    return {
      success: true,
      message: 'Movies fetched successfully',
      data: { movies, total: totalMovies },
    };
  }

  async findOne(id: string, ip: string) {
    try {
      const movie = await this.prisma.movie.findUnique({
        where: { id },
        include: GET_MOVIE_QUERY,
      });
      const lastSeason =
        movie.seasons[movie.seasons.length - 1]?.episodes?.length || 0;

      let aggregatedViews = 0;

      for (const season of movie.seasons || []) {
        for (const episode of (season.episodes || []) as any[]) {
          aggregatedViews += episode.viewsCount;
        }
      }
      return {
        success: true,
        message: 'Movie fetched successfully',
        data: {
          ...movie,
          categories: movie.categories.map((category) => category.name),
          tags: movie.tags.map((tag) => tag.name),
          directors: movie.directors.map((director) => director.name),
          studios: movie.studios.map((studio) => studio.name),
          lastSeasonEpCount: lastSeason,
          viewsCount: aggregatedViews,
          seasons: movie.seasons.map((season) => ({
            id: season.id,
            title: season.title,
            episodes: season.episodes,
          })),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error}`,
      };
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    const { directors, studios, categories, tags, ...movieData } =
      updateMovieDto;
    await this.prisma.movie.update({
      where: { id: id },
      data: {
        ...movieData,
        directors: {
          connectOrCreate: directors.map((director) => ({
            where: { name: director },
            create: { name: director },
          })),
        },
        categories: {
          connectOrCreate: categories.map((category) => ({
            where: { name: category },
            create: { name: category },
          })),
        },
        studios: {
          connectOrCreate: studios.map((studio) => ({
            where: { name: studio },
            create: { name: studio },
          })),
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    return {
      success: true,
      message: 'Movie updated successfully',
    };
  }

  async remove(id: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: id },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    await this.prisma.movie.delete({
      where: { id: id },
    });

    return {
      success: true,
      message: 'Movie deleted successfully',
    };
  }

  async addSeasonToMovie(movieId: string, title: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    await this.prisma.season.create({
      data: {
        title,
        movie: { connect: { id: movieId } },
      },
    });

    return {
      success: true,
      message: 'Season added successfully',
    };
  }

  async addEpisodeToSeason(seasonId: string, episodeData: any) {
    const season = await this.prisma.season.findUnique({
      where: { id: seasonId },
      include: { episodes: true },
    });

    const createdEpisode = await this.prisma.episode.create({
      data: {
        ...episodeData,
        season: { connect: { id: season.id } },
      },
    });

    const updatedSeason = await this.prisma.season.update({
      where: { id: seasonId },
      data: {
        episodes: { connect: { id: createdEpisode.id } },
      },
    });

    await this.prisma.movie.update({
      where: { id: season.movieId },
      data: {
        episodesCount: { increment: 1 },
        latestEpisodeDate: createdEpisode.createdAt,
        duration: { increment: createdEpisode.duration },
      },
    });

    return updatedSeason;
  }

  async addLanguageToEpisode(episodeId: string, languageData: any) {
    const episode = await this.prisma.episode.findUnique({
      where: { id: episodeId },
      include: { languages: true },
    });

    const createdLanguage = await this.prisma.language.create({
      data: {
        ...languageData,
        episode: { connect: { id: episode.id } },
      },
    });

    const updatedEpisode = await this.prisma.episode.update({
      where: { id: episodeId },
      data: {
        languages: { connect: { id: createdLanguage.id } },
      },
    });

    return updatedEpisode;
  }

  async addResolutionToLanguage(languageId: string, resolutionData: any) {
    const language = await this.prisma.language.findUnique({
      where: { id: languageId },
    });

    await this.prisma.resolution.create({
      data: { ...resolutionData, language: { connect: { id: language.id } } },
    });

    return {
      success: true,
      message: 'Resolution added successfully',
    };
  }

  async updateSeason(seasonId: string, seasonData: any) {
    await this.prisma.season.update({
      where: { id: seasonId },
      data: { ...seasonData },
    });

    return {
      success: true,
      message: 'Season updated successfully',
    };
  }

  async removeSeason(seasonId: string) {
    await this.prisma.season.delete({ where: { id: seasonId } });

    return {
      success: true,
      message: 'Season deleted successfully',
    };
  }

  async updateEpisode(episodeId: string, episodeData: any) {
    await this.prisma.episode.update({
      where: { id: episodeId },
      data: { ...episodeData },
    });

    return {
      success: true,
      message: 'Episode updated successfully',
    };
  }

  async removeEpisode(episodeId: string) {
    await this.prisma.episode.delete({ where: { id: episodeId } });

    return {
      success: true,
      message: 'Episode deleted successfully',
    };
  }

  async updateLanguage(languageId: string, languageData: { language: string }) {
    await this.prisma.language.update({
      where: { id: languageId },
      data: { ...languageData },
    });

    return {
      success: true,
      message: 'Language updated successfully',
    };
  }

  async removeLanguage(languageId: string) {
    await this.prisma.language.delete({ where: { id: languageId } });

    return {
      success: true,
      message: 'Language deleted successfully',
    };
  }

  async updateResolution(
    resolutionId: string,
    resolutionData: { resolution: string },
  ) {
    await this.prisma.resolution.update({
      where: { id: resolutionId },
      data: { ...resolutionData },
    });

    return {
      success: true,
      message: 'Resolution updated successfully',
    };
  }

  async removeResolution(resolutionId: string) {
    await this.prisma.resolution.delete({ where: { id: resolutionId } });

    return {
      success: true,
      message: 'Resolution deleted successfully',
    };
  }

  async findOneEpisode({ episodeId, movieId, ip }) {
    const episode = await this.prisma.episode.findUnique({
      where: { id: episodeId },
      include: {
        season: {
          include: {
            episodes: true,
          },
        },
        languages: {
          include: {
            resolutions: true,
          },
        },
      },
    });

    const season = await this.prisma.season.findUnique({
      where: { id: episode.seasonId },
      include: {
        movie: {
          include: {
            seasons: {
              include: {
                episodes: true,
              },
            },
          },
        },
        episodes: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    const episodes = season?.episodes || [];

    const episodeIndex = episodes.findIndex((e) => e?.id === episodeId);

    let nextEpisode = null;
    let previousEpisode = null;

    if (episodeIndex >= 0) {
      if (episodeIndex < episodes.length - 1) {
        nextEpisode = episodes[episodeIndex + 1];
      }
      if (episodeIndex > 0) {
        previousEpisode = episodes[episodeIndex - 1];
      } else if (season && season.episodes.length > 1) {
        const previousSeasonIndex = season.movie.seasons.findIndex(
          (s) => s?.id === season?.id,
        );

        if (previousSeasonIndex > 0) {
          const previousSeason = season.movie.seasons[previousSeasonIndex - 1];
          previousEpisode =
            previousSeason.episodes[previousSeason.episodes.length - 1];
        }
      }
    }

    await this.prisma.episode.update({
      where: { id: episodeId },
      data: { viewsCount: episode.viewsCount + 1 },
    });

    await this.prisma.view.create({
      data: {
        viewerIP: ip,
        episode: { connect: { id: episodeId } },
      },
    });

    console.log(previousEpisode, nextEpisode);

    await this.prisma.movie.findUnique({ where: { id: movieId } });

    return {
      success: true,
      message: 'Episode fetched successfully',
      data: {
        previousEpisode: previousEpisode?.id ?? null,
        nextEpisode: nextEpisode?.id ?? null,
        ...episode,
        // movie,
      },
    };
  }

  async topWatchedMovies({ page, limit, user }) {
    page = Number(page) || 0;
    limit = Number(limit) || 10;

    const skip = page * limit;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const where = {};

    if (user?.role !== 'ADMIN') {
      where['visible'] = true;
    }

    const topWatchedMovies = await this.prisma.view.groupBy({
      by: 'movieId',
      _count: {
        movieId: true,
      },
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
        movieId: {
          not: {
            equals: null,
          },
        },
      },
      orderBy: {
        _count: {
          movieId: 'desc',
        },
      },
    });

    const movieIds = topWatchedMovies.map((entry) => entry.movieId);
    const topMovies: any = await this.prisma.movie.findMany({
      where: {
        id: {
          in: movieIds,
        },
      },
      skip,
      take: limit,
      orderBy: {
        viewsCount: 'desc',
      },
      include: {
        categories: true,
        seasons: {
          select: {
            episodes: true,
          },
        },
      },
    });

    topMovies.map((movie) => {
      movie.categories = movie.categories.map((category) => category.name);
      movie.lastSeasonEpCount =
        movie.seasons[movie.seasons.length - 1]?.episodes?.length || 0;
      delete movie.seasons;
      // movie.seasons[movie.seasons.length - 1].episodes.length || 0;
    });

    return {
      success: true,
      message: 'Movies fetched successfully',
      data: { movies: topMovies, total: topMovies.length },
    };
  }
}
