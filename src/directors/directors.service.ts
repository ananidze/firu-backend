import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DirectorsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createDirectorDto: CreateDirectorDto) {
    return 'This action adds a new director';
  }

  async findAll(query: string) {
    const directors = await this.prisma.director.findMany({
      select: { name: true },
      where: { name: { contains: query } },
    });

    const directorNames = directors.map((director) => director.name);

    return { data: directorNames, status: HttpStatus.OK };
  }

  async findOne(id: number) {
    return `This action returns a #${id} director`;
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    return `This action updates a #${id} director`;
  }

  remove(id: number) {
    return `This action removes a #${id} director`;
  }
}
