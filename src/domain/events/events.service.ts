import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { PaginatedOutputDto } from 'src/common/dto/paginated-output.dto';
import { EventQueryDto } from './dto/event-query.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { OutputDto } from 'src/common/dto/output.dto';
import { InvalidOperationError } from 'src/common/errors/invalid-operation-error';

// TODO: put up a better way to deal with incoming dates!
@Injectable()
export class EventsService {
  constructor(private prismaService: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    const { creator_id, date, description, location, title } = createEventDto;
    return await this.prismaService.event.create({
      data: {
        creator: { connect: { user_id: creator_id } },
        date,
        description,
        location,
        title,
      },
    });
  }

  async findAll(
    query: EventQueryDto,
  ): Promise<PaginatedOutputDto<EventResponseDto>> {
    const {
      page = '1',
      limit = '10',
      location,
      title,
      sort_by,
      order_by,
    } = query;
    const page_size = +limit;
    const current_page = +page;

    let { creator_id } = query;
    creator_id = +creator_id;

    if (creator_id) {
      await this.prismaService.user.findFirstOrThrow({
        where: { user_id: creator_id },
      });
    }

    const orderByKeys = ['title', 'date', 'created_at', 'event_id', 'location'];
    const isValidOrderBy = sort_by && orderByKeys.includes(sort_by);
    const orderBy = isValidOrderBy ? { [sort_by]: order_by || 'asc' } : {};

    const where = {
      ...(creator_id ? { creator_id } : {}),
      ...(title ? { title: { contains: title } } : {}),
      ...(location ? { title: { contains: location } } : {}),
    };
    const [events, total_records] = await Promise.all([
      this.prismaService.event.findMany({
        where,
        orderBy,
        skip: (current_page - 1) * page_size,
        take: page_size,
      }),
      this.prismaService.event.count({ where }),
    ]);

    return {
      data: events,
      pagination: {
        total_records,
        current_page,
        page_size,
        total_pages: Math.ceil(total_records / page_size),
      },
    };
  }

  async findOne(id: number): Promise<OutputDto<EventResponseDto>> {
    const data = await this.prismaService.event.findFirstOrThrow({
      where: { event_id: id },
    });
    return { data };
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    request: any,
  ): Promise<OutputDto<EventResponseDto>> {
    const event = await this.prismaService.event.findFirstOrThrow({
      where: { event_id: id },
    });

    this._validateUserToken(event.creator_id, request);

    const data = await this.prismaService.event.update({
      where: { event_id: id },
      data: updateEventDto,
    });

    return { data };
  }

  async remove(id: number, request: any): Promise<OutputDto<EventResponseDto>> {
    const event = await this.prismaService.event.findFirstOrThrow({
      where: { event_id: id },
    });

    // Only the event creator can delete it
    this._validateUserToken(event.creator_id, request);

    const data = await this.prismaService.event.delete({
      where: { event_id: id },
    });

    return { data };
  }

  _validateUserToken(id: number, request: any) {
    if (request?.user?.sub != id) {
      throw new InvalidOperationError(
        'You are not allowed to do this operation.',
      );
    }
  }
}
