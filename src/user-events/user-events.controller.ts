import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { UserEventsService } from './user-events.service';
import { CreateUserEventDto } from './dto/create-user-event.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserEventQueryDto } from './dto/user-event-query.dto';

@ApiTags('User Events')
@Controller('user-events')
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}

  @Get()
  findAllParticipants(@Query() query: UserEventQueryDto) {
    return this.userEventsService.findAll(query);
  }

  @Post('add')
  addUserToEvent(@Body() createUserEventDto: CreateUserEventDto) {
    return this.userEventsService.addUserToEvent(createUserEventDto);
  }

  @Post('remove')
  removeUserFromEvent(@Body() createUserEventDto: CreateUserEventDto) {
    return this.userEventsService.removeUserFromEvent(createUserEventDto);
  }

  @Patch()
  updateStatus(@Body() dto: CreateUserEventDto) {
    return this.userEventsService.updateStatus(dto);
  }
}
