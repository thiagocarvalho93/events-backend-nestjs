import { Controller, Get, Post, Body, Query, Patch } from '@nestjs/common';
import { UserEventsService } from './user-events.service';
import { CreateUserEventDto } from './dto/create-user-event.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEventQueryDto } from './dto/user-event-query.dto';

@ApiTags('User Events')
@ApiBearerAuth()
@Controller('user-events')
export class UserEventsController {
  constructor(private readonly userEventsService: UserEventsService) {}

  @ApiOperation({
    summary: 'Find all the event participants based on filters.',
  })
  @Get()
  findAllParticipants(@Query() query: UserEventQueryDto) {
    return this.userEventsService.findAll(query);
  }

  @ApiOperation({ summary: 'Add the participant to the event.' })
  @Post('add')
  addUserToEvent(@Body() createUserEventDto: CreateUserEventDto) {
    return this.userEventsService.addUserToEvent(createUserEventDto);
  }

  @ApiOperation({ summary: 'Remove the participant from the event.' })
  @Post('remove')
  removeUserFromEvent(@Body() createUserEventDto: CreateUserEventDto) {
    return this.userEventsService.removeUserFromEvent(createUserEventDto);
  }

  @ApiOperation({ summary: 'Update status from the participant.' })
  @Patch()
  updateStatus(@Body() dto: CreateUserEventDto) {
    return this.userEventsService.updateStatus(dto);
  }
}
