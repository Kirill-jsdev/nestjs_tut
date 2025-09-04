import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { MetaOptionsModule } from './meta-options/meta-options.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, //makes the module available globally without needing to import it in other modules
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'nest',
        password: 'nest',
        database: 'nestdb',
        // entities: [User], //we do not need this as we are using autoLoadEntities
        autoLoadEntities: true,
        synchronize: true, // Note: set to false in production. This way during development we will not need to use migrations
      }),
    }),
    TagsModule,
    MetaOptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
