import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma/prisma.module';
import { UsersModule } from './models/users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './models/events/events.module';
import { CommentsModule } from './models/comments/comments.module';
import { UserEventsModule } from './models/user-events/user-events.module';

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
