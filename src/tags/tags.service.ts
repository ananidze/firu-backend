import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  async findAll(query: string) {
    const tags = await this.prisma.tag.findMany({
      select: { name: true },
      where: { name: { contains: query } },
    });

    const tagNames = tags.map((tag) => tag.name);

    return { data: tagNames, status: HttpStatus.OK };
  }

  async findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  async remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
