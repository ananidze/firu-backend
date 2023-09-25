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
import { StudiosService } from './studios.service';
import { CreateStudioDto } from './dto/create-studio.dto';
import { UpdateStudioDto } from './dto/update-studio.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('studios')
@ApiTags('studios')
export class StudiosController {
  constructor(private readonly studiosService: StudiosService) {}

  @Post()
  create(@Body() createStudioDto: CreateStudioDto) {
    return this.studiosService.create(createStudioDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false })
  findAll(@Query('name') query: string) {
    return this.studiosService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studiosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudioDto: UpdateStudioDto) {
    return this.studiosService.update(+id, updateStudioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studiosService.remove(+id);
  }
}
