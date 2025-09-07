import {
  IsArray,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PostStatusEnum } from '../enums/post-stutus.enum';
import { PostTypeEnum } from '../enums/post-type.enum';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-meta-options.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'My first post',
    description: 'The title of the post',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'post',
    description: 'The type of the post',
    enum: PostTypeEnum,
  })
  @IsEnum(PostTypeEnum)
  @IsNotEmpty()
  postType: PostTypeEnum;

  @ApiProperty({
    example: 'my-first-post',
    description: 'The slug of the post',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([a-z0-9]+)(?:-[a-z0-9]+)*$/, {
    message: 'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  @MaxLength(256)
  slug: string;

  @ApiProperty({
    example: 'draft',
    description: 'The status of the post',
    enum: PostStatusEnum,
  })
  @IsEnum(PostStatusEnum)
  @IsNotEmpty()
  status: PostStatusEnum;

  @ApiPropertyOptional({
    example: 'This is the content of my first post.',
    description: 'The content of the post',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    example:
      '{ "type": "object", "properties": { "author": { "type": "string" }, "views": { "type": "number" } }, "required": ["author"] } }',
    description: 'The schema of the post',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    example: 'http://example.com/image.jpg',
    description: 'The featured image URL of the post',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    example: '2023-01-01T00:00:00Z',
    description: 'The published date of the post',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn: Date;

  @ApiPropertyOptional({
    description: 'Ids of the tags associated with the post',
    example: [1, 2, 3],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    description: 'The meta options of the post',
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'The metaValue is a JSON string',
          example: '{ "key": "value" }',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;
}
