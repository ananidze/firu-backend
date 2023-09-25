import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('title') title: string,
    @Query('type') type: string,
  ) {
    console.log(title);
    return this.moviesService.findAll(page, limit, title, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(1);
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @Post(':id/seasons')
  addSeasonToMovie(@Param('id') id: string, @Body('title') title: string) {
    return this.moviesService.addSeasonToMovie(id, title);
  }

  @Patch(':id/seasons/:seasonId')
  updateSeason(
    @Param('id') id: string,
    @Param('seasonId') seasonId: string,
    @Body() seasonData: any,
  ) {
    return this.moviesService.updateSeason(seasonId, seasonData);
  }

  @Delete(':id/seasons/:seasonId')
  removeSeason(@Param('id') id: string, @Param('seasonId') seasonId: string) {
    return this.moviesService.removeSeason(seasonId);
  }

  @Post(':id/seasons/:seasonId/episodes')
  addEpisodeToSeason(
    @Param('id') movieId: string,
    @Param('seasonId') seasonId: string,
    @Body() episodeData: any,
  ) {
    return this.moviesService.addEpisodeToSeason(
      movieId,
      seasonId,
      episodeData,
    );
  }

  @Patch(':id/seasons/:seasonId/episodes/:episodeId')
  updateEpisode(
    @Param('id') movieId: string,
    @Param('seasonId') seasonId: string,
    @Param('episodeId') episodeId: string,
    @Body() episodeData: any,
  ) {
    return this.moviesService.updateEpisode(episodeId, episodeData);
  }

  @Delete(':id/seasons/:seasonId/episodes/:episodeId')
  removeEpisode(
    @Param('id') movieId: string,
    @Param('seasonId') seasonId: string,
    @Param('episodeId') episodeId: string,
  ) {
    return this.moviesService.removeEpisode(episodeId);
  }

  @Post(':id/seasons/:seasonId/episodes/:episodeId/languages')
  async addLanguageToEpisode(
    @Param('id') movieId: string,
    @Param('seasonId') seasonId: string,
    @Param('episodeId') episodeId: string,
    @Body() languageData: { language: string },
  ) {
    return this.moviesService.addLanguageToEpisode(
      seasonId,
      episodeId,
      languageData,
    );
  }

  @Patch(':id/seasons/:seasonId/episodes/:episodeId/languages/:languageId')
  async updateLanguage(
    @Param('id') movieId: string,
    @Param('seasonId') seasonId: string,
    @Param('episodeId') episodeId: string,
    @Param('languageId') languageId: string,
    @Body() languageData: { language: string },
  ) {
    return this.moviesService.updateLanguage(languageId, languageData);
  }

  @Delete(':id/seasons/:seasonId/episodes/:episodeId/languages/:languageId')
  async removeLanguage(
    @Param('id') movieId: string,
    @Param('seasonId') seasonId: string,
    @Param('episodeId') episodeId: string,
    @Param('languageId') languageId: string,
  ) {
    return this.moviesService.removeLanguage(languageId);
  }

  @Post(
    ':id/seasons/:seasonId/episodes/:episodeId/languages/:languageId/resolutions',
  )
  async addResolutionToLanguage(
    @Param('id') movieId: string,
    @Param('languageId') languageId: string,
    @Body() resolutionData: { resolution: string },
  ) {
    return this.moviesService.addResolutionToLanguage(
      languageId,
      resolutionData,
    );
  }

  @Patch(
    ':id/seasons/:seasonId/episodes/:episodeId/languages/:languageId/resolutions/:resolutionId',
  )
  async updateResolution(
    @Param('id') movieId: string,
    @Param('languageId') languageId: string,
    @Param('resolutionId') resolutionId: string,
    @Body() resolutionData: { resolution: string },
  ) {
    return this.moviesService.updateResolution(resolutionId, resolutionData);
  }

  @Delete(
    ':id/seasons/:seasonId/episodes/:episodeId/languages/:languageId/resolutions/:resolutionId',
  )
  async removeResolution(
    @Param('id') movieId: string,
    @Param('languageId') languageId: string,
    @Param('resolutionId') resolutionId: string,
  ) {
    return this.moviesService.removeResolution(resolutionId);
  }
}
