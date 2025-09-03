import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostTypeEnum } from './enums/post-type.enum';
import { PostStatusEnum } from './enums/post-stutus.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: PostTypeEnum,
    nullable: false,
    default: PostTypeEnum.POST,
  })
  postType: PostTypeEnum;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: PostStatusEnum,
    nullable: false,
    default: PostStatusEnum.DRAFT,
  })
  status: PostStatusEnum;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishedOn?: Date;

  //Will be implemented later when start working on relationships
  tags?: string[];

  @OneToOne(() => MetaOption, {
    cascade: true,
  }) //every post will have only one meta option related to it
  @JoinColumn() //this decorator will create a foreign key column in the post table
  metaOptions?: MetaOption; // in the DB this column will be named "metaOptionsId" because of JoinColumn decorator
}
