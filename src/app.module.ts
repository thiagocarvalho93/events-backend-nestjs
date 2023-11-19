import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CommentsModule } from './comments/comments.module';
import { UserEventsModule } from './user-events/user-events.module';

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
