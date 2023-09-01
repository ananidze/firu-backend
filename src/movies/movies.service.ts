import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createMovieDto: CreateMovieDto) {
    const { directors, studios, categories, tags, ...movieData } = createMovieDto;
  
    const tagIds = await this.upsertAndReturnIds(this.prisma.tag, tags);
    const directorIds = await this.upsertAndReturnIds(this.prisma.director, directors);
    const studioIds = await this.upsertAndReturnIds(this.prisma.studio, studios);
    const categoryIds = await this.upsertAndReturnIds(this.prisma.category, categories);
    const createdMovie = await this.prisma.movie.create({
      data: {
        ...movieData,
        directors: { connect: directorIds },
        studios: { connect: studioIds },
        categories: { connect:  categoryIds},
        tags: { connect: tagIds },
      },
    });
  
    return { data: { _id: createdMovie.id }, statusCode: HttpStatus.CREATED };
  }
  
   async upsertAndReturnIds(model: any, names: string[]) {
    return Promise.all(
      names.map(async (name) => {
        const entity = await model.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        return { id: entity.id };
      })
    );
  }
  

  findAll() {
    return `This action returns all movies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
