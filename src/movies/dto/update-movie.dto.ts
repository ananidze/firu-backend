import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMovieDto } from './create-movie.dto';
import { IsBoolean } from 'class-validator';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @IsBoolean()
  @ApiProperty({ type: Boolean, default: false })
  readonly visible: boolean;
}
