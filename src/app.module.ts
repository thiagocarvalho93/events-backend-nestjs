import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './domain/events/events.module';
import { CommentsModule } from './domain/comments/comments.module';
import { UserEventsModule } from './domain/user-events/user-events.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    EventsModule,
    CommentsModule,
    UserEventsModule,
  ],
})
export class AppModule {}
