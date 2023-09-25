import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  async findAll(query: string) {
    const categories = await this.prisma.category.findMany({
      select: { name: true },
      where: { name: { contains: query } },
    });

    const categoryNames = categories.map((category) => category.name);

    return { data: categoryNames, status: HttpStatus.OK };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}