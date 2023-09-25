import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StudiosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStudioDto: CreateStudioDto) {
    return 'This action adds a new studio';
  }

  async findAll(query: string) {
    const studios = await this.prisma.studio.findMany({
      select: { name: true },
      where: { name: { contains: query } },
    });

    const studioNames = studios.map((studio) => studio.name);

    return { data: studioNames, status: HttpStatus.OK };
  }

  findOne(id: number) {
    return `This action returns a #${id} studio`;
  }

  update(id: number, updateStudioDto: UpdateStudioDto) {
    return `This action updates a #${id} studio`;
  }

  remove(id: number) {
    return `This action removes a #${id} studio`;
  }
}
