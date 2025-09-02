import { PostStatusEnum } from '../enums/post-stutus.enum';
import { PostTypeEnum } from '../enums/post-type.enum';

export class CreatePostDto {
  title: string;
  postType: PostTypeEnum;
  slug: string;
  status: PostStatusEnum;
  content?: string;
  schema?: string;
  featuredImageUrl?: string;
  publishedOn: Date;
  tags?: string[];
  metaOptions?: [{ key: 'sidebar'; value: true }];
}
