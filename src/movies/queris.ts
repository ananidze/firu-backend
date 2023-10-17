export const GET_MOVIE_QUERY = {
  directors: true,
  studios: true,
  tags: true,
  categories: true,
  seasons: {
    include: {
      episodes: true,
    },
  },
};

export const GET_MOVIES_QUERY = {
  id: true,
  title: true,
  titleEn: true,
  poster: true,
  banner: true,
  trailer: true,
  year: true,
  seasonsCount: true,
  seasons: {
    select: {
      episodes: true,
    },
  },
};
