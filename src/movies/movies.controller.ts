import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Ip,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('movies')
@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('movies')
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get('movies')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'sort', required: false, type: String })
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('title') title: string,
    @Query('type') type: string,
    @Query('sort') sort: string,
    @Req() req,
  ) {
    return this.moviesService.findAll(page, limit, title, type, sort, req.user);
  }

  @Get('movies/top')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getTopMovies(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Req() req: any,
  ) {
    return this.moviesService.topWatchedMovies({ page, limit, user: req.user });
  }

  @Get('movies/:id')
  findOne(@Param('id') id: string, @Ip() ip: string) {
    return this.moviesService.findOne(id, ip);
  }

  @Patch('movies/:id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete('movies/:id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @Post('movies/:id/seasons')
  addSeasonToMovie(@Param('id') id: string, @Body('title') title: string) {
    return this.moviesService.addSeasonToMovie(id, title);
  }

  @Patch('seasons/:seasonId')
  updateSeason(@Param('seasonId') seasonId: string, @Body() seasonData: any) {
    return this.moviesService.updateSeason(seasonId, seasonData);
  }

  @Delete('seasons/:seasonId')
  removeSeason(@Param('seasonId') seasonId: string) {
    return this.moviesService.removeSeason(seasonId);
  }

  @Post('seasons/:seasonId/episodes')
  addEpisodeToSeason(
    @Param('seasonId') seasonId: string,
    @Body() episodeData: any,
  ) {
    return this.moviesService.addEpisodeToSeason(seasonId, episodeData);
  }

  @Get('movies/:movieId/episodes/:episodeId')
  findOneEpisode(
    @Param('movieId') movieId: string,
    @Param('episodeId') episodeId: string,
    @Ip() ip: string,
  ) {
    return this.moviesService.findOneEpisode({ episodeId, movieId, ip });
  }

  @Patch('episodes/:episodeId')
  updateEpisode(
    @Param('episodeId') episodeId: string,
    @Body() episodeData: any,
  ) {
    return this.moviesService.updateEpisode(episodeId, episodeData);
  }

  @Delete('episodes/:episodeId')
  removeEpisode(@Param('episodeId') episodeId: string) {
    return this.moviesService.removeEpisode(episodeId);
  }

  @Post('episodes/:episodeId/languages')
  async addLanguageToEpisode(
    @Param('episodeId') episodeId: string,
    @Body() languageData: { language: string },
  ) {
    return this.moviesService.addLanguageToEpisode(episodeId, languageData);
  }

  @Patch('languages/:languageId')
  async updateLanguage(
    @Param('languageId') languageId: string,
    @Body() languageData: { language: string },
  ) {
    return this.moviesService.updateLanguage(languageId, languageData);
  }

  @Delete('languages/:languageId')
  async removeLanguage(@Param('languageId') languageId: string) {
    return this.moviesService.removeLanguage(languageId);
  }

  @Post('languages/:languageId/resolutions')
  async addResolutionToLanguage(
    @Param('languageId') languageId: string,
    @Body() resolutionData: { resolution: string },
  ) {
    return this.moviesService.addResolutionToLanguage(
      languageId,
      resolutionData,
    );
  }

  @Patch('resolutions/:resolutionId')
  async updateResolution(
    @Param('resolutionId') resolutionId: string,
    @Body() resolutionData: { resolution: string },
  ) {
    return this.moviesService.updateResolution(resolutionId, resolutionData);
  }

  @Delete('resolutions/:resolutionId')
  async removeResolution(@Param('resolutionId') resolutionId: string) {
    return this.moviesService.removeResolution(resolutionId);
  }
}
