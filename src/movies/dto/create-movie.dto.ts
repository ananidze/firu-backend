import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsArray,
  IsNotEmpty,
  IsUrl,
  IsEnum,
} from 'class-validator';

enum AgeRating {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG-13',
  R = 'R',
  NC17 = 'NC-17',
}

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The title of the movie' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The title of the movie in English' })
  titleEn: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'The year of the movie' })
  year: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'The directors of the movie' })
  directors: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'The writers of the movie' })
  studios: string[];

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ description: 'The poster of the movie' })
  poster: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ description: 'The banner of the movie' })
  banner: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ description: 'The logo of the movie' })
  logo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The country of the movie' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The language of the movie' })
  description: string;

  // @IsNumberString()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The duration of the movie' })
  imdb: string;

  @IsEnum(AgeRating)
  @IsNotEmpty()
  @ApiProperty({ description: 'The age rating of the movie' })
  age: AgeRating;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The type of the movie' })
  type: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'The categories of the movie' })
  categories: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'The tags of the movie' })
  tags: string[];
}
